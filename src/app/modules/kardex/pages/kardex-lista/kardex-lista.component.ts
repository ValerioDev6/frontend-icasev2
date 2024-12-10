import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import Swal from 'sweetalert2';
import { KardexService } from '../../../../core/services/kardex.service';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Kardex } from '../../../../core/interfaces/kardex.interface';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
	selector: 'app-kardex-lista',
	standalone: true,
	imports: [
		RouterModule,
		NzInputModule,
		NzIconModule,
		NzButtonModule,
		ReactiveFormsModule,
		NzTableModule,
		NzPaginationModule,
		NzFormModule,
		NzLayoutModule,
		NzToolTipModule,
		NzSelectModule,
		ReactiveFormsModule,
		FormsModule,
		NzDropDownModule,
		NzMessageModule,
		NzBreadCrumbModule,
		NzSpaceModule,
		CommonModule,
		NzTagModule,
		NzDatePickerModule,
	],
	templateUrl: './kardex-lista.component.html',
	providers: [DatePipe],
	styleUrl: './kardex-lista.component.scss',
})
export default class KardexListaComponent implements OnInit {
	constructor(
		private readonly _kardexService: KardexService,
		private readonly message: NzMessageService,
		private datePipe: DatePipe
	) {}
	kardex: Kardex[] = [];
	loading = false;

	search: string = '';
	startDate: string | null = null;
	endDate: string | null = null;
	tipoMovimiento: 'ENTRADA' | 'SALIDA' | null = null;
	tipoDocumento: 'COMPRA' | 'VENTA' | null = null;

	page: number = 1;
	limit: number = 10;
	total: number = 0;
	dateRange: Date[] = [];
	ngOnInit(): void {
		this.loadKardexData();
	}

	loadKardexData(): void {
		this.loading = true;
		this._kardexService
			.getKardexData(
				this.page,
				this.limit,
				this.startDate || undefined,
				this.endDate || undefined,
				this.tipoMovimiento || undefined,
				this.tipoDocumento || undefined
			)
			.subscribe({
				next: (response) => {
					this.kardex = response.kardex;
					this.total = response.info.total;
					this.loading = false;
				},
				error: (error) => {
					console.error(error);
					this.message.error('Error al cargar los datos');
					this.loading = false;
				},
			});
	}

	searchTo(): void {
		this.page = 1;
		this.loadKardexData();
	}

	onPageChange(page: number): void {
		this.page = page;
		this.loadKardexData();
	}

	filterByTipoMovimiento(tipo: 'ENTRADA' | 'SALIDA' | null): void {
		this.tipoMovimiento = tipo;
		this.page = 1;
		this.loadKardexData();
	}

	filterByTipoDocumento(tipo: 'COMPRA' | 'VENTA' | null): void {
		this.tipoDocumento = tipo;
		this.page = 1;
		this.loadKardexData();
	}

	filterByDateRange(): void {
		if (this.dateRange) {
			const [start, end] = this.dateRange;

			this.startDate = start ? this.datePipe.transform(start, "yyyy-MM-dd'T'HH:mm:ss'Z'") : null;
			this.endDate = end ? this.datePipe.transform(end, "yyyy-MM-dd'T'HH:mm:ss'Z'") : null;
		} else {
			this.startDate = null;
			this.endDate = null;
		}

		this.page = 1;
		this.loadKardexData();
	}
	clearFilters(): void {
		this.search = '';
		this.dateRange = [];
		this.startDate = null;
		this.endDate = null;
		this.tipoMovimiento = null;
		this.tipoDocumento = null;

		this.page = 1;
		this.loadKardexData();
	}

	deleteKardex(kardex: Kardex) {
		Swal.fire({
			title: '¿Está seguro?',
			text: `Este proceso no es reversible, está a punto de eliminar su movimiento realizado el ${kardex.fecha_movimiento}`,
			showCancelButton: true,
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'No, cancelar',
			customClass: {
				popup: 'swal2-popup-custom',
				title: 'swal2-title-custom',
				htmlContainer: 'swal2-html-container-custom',
				confirmButton: 'swal2-confirm-button-custom',
				cancelButton: 'swal2-cancel-button-custom',
			},
			buttonsStyling: false,
			iconHtml:
				'<svg xmlns="http:www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-16 h-16 text-red-500"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
		}).then((result) => {
			if (result.isConfirmed) {
				this.loading = true;
				this._kardexService.deleteKardexById(kardex.id_kardex).subscribe({
					next: () => {
						this.loadKardexData();
						this.message.success('Movimiento  eliminado con éxito');
					},
					error: () => {
						this.loading = false;
						this.message.error('Error al eliminar el Movimiento');
					},
				});
			}
		});
	}
}
