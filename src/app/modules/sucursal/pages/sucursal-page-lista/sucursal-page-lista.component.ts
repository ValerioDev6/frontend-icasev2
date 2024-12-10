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
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { CommonModule } from '@angular/common';
import { ISucursalResponse, Sucursale } from '../../../../core/interfaces/sucursales.interface';
import { SucursalService } from '../../../../core/services/sucursales.service';
import Swal from 'sweetalert2';
import { CrearSucursalComponent } from '../../components/crear-sucursal/crear-sucursal.component';
import { ActualizarSucursalComponent } from '../../components/actualizar-sucursal/actualizar-sucursal.component';
const NZ_MODULES = [
	NzInputModule,
	NzIconModule,
	NzButtonModule,
	NzTableModule,
	NzPaginationModule,
	NzFormModule,
	NzLayoutModule,
	NzSelectModule,
	NzDropDownModule,
	NzDividerModule,
	NzCardModule,
	NzTagModule,
	NzBreadCrumbModule,
	NzToolTipModule,
];
@Component({
	selector: 'app-sucursal-page-lista',
	standalone: true,
	imports: [NZ_MODULES, RouterModule, ReactiveFormsModule, FormsModule, CommonModule, NzModalModule],
	templateUrl: './sucursal-page-lista.component.html',
	styleUrl: './sucursal-page-lista.component.scss',
})
export default class SucursalPageListaComponent implements OnInit {
	sucursales: Sucursale[] = [];
	loading = false;
	search: string = '';
	page: number = 1;
	limit: number = 10;
	total: number = 0;

	constructor(
		private readonly _sucursalesService: SucursalService,
		private readonly _modal: NzModalService,
		private readonly message: NzMessageService
	) {}

	ngOnInit(): void {
		this.loadDataSucursales();
	}

	loadDataSucursales() {
		this.loading = true;
		this._sucursalesService.getSucursalData(this.page, this.limit, this.search).subscribe({
			next: (response: ISucursalResponse) => {
				this.sucursales = response.sucursales;
				this.total = response.info.total;
				this.loading = false;
			},
		});
	}

	searchTo() {
		this.page = 1;
		this.loadDataSucursales();
	}

	onPageChange(page: number) {
		this.page = page;
		this.loadDataSucursales();
	}
	openAgregarSucursalModal(): void {
		const modal = this._modal.create({
			nzTitle: 'Agregar Nuevo Sucursal',
			nzContent: CrearSucursalComponent,
			nzFooter: null,
			nzWidth: '500px',
		});

		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadDataSucursales();
			}
		});
	}

	openEditarModal(sucursal: Sucursale): void {
		const modal = this._modal.create({
			nzTitle: 'Editar Sucursal',
			nzContent: ActualizarSucursalComponent,
			nzData: { id_sucursal: sucursal.id_sucursal },
			nzFooter: null,
			nzWidth: '500px',
		});

		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadDataSucursales();
			}
		});
	}
	deleteSucursal(sucursal: Sucursale) {
		Swal.fire({
			title: '¿Está seguro?',
			text: `Este proceso no es reversible, está a punto de eliminar la sucursal , ${sucursal.nombre_sucursal}`,
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
				this._sucursalesService.deleteSucursal(sucursal.id_sucursal).subscribe({
					next: () => {
						this.loadDataSucursales();
						this.message.success('Sucursal eliminada con éxito');
					},
					error: () => {
						this.loading = false;
						this.message.error('Error al eliminar la Sucursal');
					},
				});
			}
		});
	}
}
