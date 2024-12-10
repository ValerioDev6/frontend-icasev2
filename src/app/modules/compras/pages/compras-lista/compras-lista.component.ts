import { CommonModule } from '@angular/common';
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
import { ComprasService } from '../../../../core/services/compras.service';
import { Compra, IComprasPaginationResponse } from '../../../../core/interfaces/compras.interface';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import Swal from 'sweetalert2';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { TableComprasModalComponent } from '../../components/table-compras-modal/table-compras-modal.component';
import { ReportesPdfService } from '../../../../core/services/reports/reportes-pdf.service';
import { ReportesExcelService } from '../../../../core/services/reports/reportes-excel.service';

@Component({
	selector: 'app-compras-lista',
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
		NzBreadCrumbModule,
		NzModalModule,
	],
	templateUrl: './compras-lista.component.html',
	styleUrl: './compras-lista.component.scss',
	providers: [NzModalService],
})
export default class ComprasListaComponent implements OnInit {
	constructor(
		private readonly _comprasService: ComprasService,
		private readonly reportePdfService: ReportesPdfService,
		private readonly reporteExcelService: ReportesExcelService,
		private readonly message: NzMessageService,
		private readonly _modal: NzModalService
	) {}
	compras: Compra[] = [];
	loading = false;
	search: string = '';
	page: number = 1;
	limit: number = 10;
	total: number = 0;

	ngOnInit(): void {
		this.loadComprasData();
	}

	loadComprasData() {
		this.loading = true;
		this._comprasService.getComprasData(this.page, this.limit, this.search).subscribe({
			next: (resposne: IComprasPaginationResponse) => {
				this.compras = resposne.compras;
				this.total = resposne.info.total;
				this.loading = false;
			},
			error: (error) => {
				console.log(error);
			},
		});
	}

	searchTo() {
		this.page = 1;
		this.loadComprasData();
	}
	onPageChange(page: number) {
		this.page = page;
		this.loadComprasData();
	}

	downloadPDF(): void {
		this.reportePdfService.downloadComprasPDF().subscribe({
			next: (blob: Blob) => {
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = 'reporte_compras.pdf';
				link.click();
				window.URL.revokeObjectURL(url);
			},
			error: (error) => {
				this.message.error('Error al descargar el PDF');
				console.error('Error downloading PDF:', error);
			},
		});
	}
	descargarExcel(): void {
		this.reporteExcelService.descargarExcelCompras().subscribe({
			next: (blob: Blob) => {
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = 'reporte_compras.xlsx';
				link.click();
				window.URL.revokeObjectURL(url);
			},
			error: (error) => {
				this.message.error('Error al descargar el Excel');
				console.error('Error downloading Excel:', error);
			},
		});
	}

	openDetallesModal(compra: Compra) {
		const modal = this._modal.create({
			nzContent: TableComprasModalComponent,
			nzData: {
				id_compra: compra.id_compra,
			},
			nzWidth: '60%',
			nzFooter: null,
			nzStyle: {
				top: '10px',
			},
		});
		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadComprasData();
			}
		});
	}

	deleleCompra(compra: Compra) {
		Swal.fire({
			title: '¿Está seguro?',
			text: `Este proceso no es reversible, está a punto de eliminar su compra`,
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
				this._comprasService.deleteComprasById(compra.id_compra).subscribe({
					next: () => {
						this.loadComprasData();
						this.message.success('Compra eliminado con éxito');
					},
					error: () => {
						this.loading = false;
						this.message.error('Error al eliminar la Compra');
					},
				});
			}
		});
	}

	obtenerNombreProveedor(compra: Compra): string {
		const proveedor = compra.tb_proveedores;
		if (!proveedor) return 'Sin nombre'; // Manejar si tb_proveedores es null o undefined

		// Revisar razon_social
		if (proveedor.tb_personas?.razon_social && proveedor.tb_personas.razon_social !== 'null') {
			return proveedor.tb_personas.razon_social;
		}

		// Devolver nombres directamente si están disponibles
		if (proveedor.tb_personas?.nombres) {
			return proveedor.tb_personas.nombres;
		}

		return 'Sin nombre'; // Valor predeterminado
	}
}
