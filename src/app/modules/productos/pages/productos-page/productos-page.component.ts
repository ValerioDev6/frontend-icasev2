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
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import Swal from 'sweetalert2';
import { ProductoService } from '../../../../core/services/productos.service';
import { IProductoResponse, Producto } from '../../../../core/interfaces/producto.interface';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { ReportesPdfService } from '../../../../core/services/reports/reportes-pdf.service';
import { ReportesExcelService } from '../../../../core/services/reports/reportes-excel.service';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { PeruvianCurrencyPipe } from '../../../../shared/pipes/pipe-currency.pipe';
import { UploadProductoComponent } from '../../components/upload-producto/upload-producto.component';
const NZ_MODULES = [
	NzInputModule,
	NzIconModule,
	NzButtonModule,
	NzTableModule,
	NzPaginationModule,
	NzFormModule,
	NzLayoutModule,
	NzToolTipModule,
	NzSelectModule,
	NzDropDownModule,
	NzDividerModule,
	NzCardModule,
	NzTagModule,
	NzBreadCrumbModule,
	NzToolTipModule,
	NzSpaceModule,
	NzPopconfirmModule,
];

@Component({
	selector: 'app-productos-page',
	standalone: true,
	imports: [
		CommonModule,
		NgxBarcode6Module,
		RouterModule,
		ReactiveFormsModule,
		FormsModule,
		NZ_MODULES,
		NzModalModule,
		PeruvianCurrencyPipe,
	],
	templateUrl: './productos-page.component.html',
	styleUrl: './productos-page.component.scss',
})
export default class ProductosPageComponent implements OnInit {
	constructor(
		private readonly _modal: NzModalService,
		private readonly _productoService: ProductoService,
		private readonly message: NzMessageService,
		private reportePdfService: ReportesPdfService,
		private reporteExcelService: ReportesExcelService
	) {}

	productos: Producto[] = [];
	loading = false;
	search: string = '';
	page: number = 1;
	limit: number = 8;
	total: number = 0;

	ngOnInit(): void {
		this.loadDataProducto();
	}

	loadDataProducto() {
		this.loading = true;
		this._productoService.getProductosData(this.page, this.limit, this.search).subscribe({
			next: (response: IProductoResponse) => {
				this.productos = response.productos;
				this.total = response.info.total;
				this.loading = false;
			},
		});
	}

	openUploadProducto() {
		const modal = this._modal.create({
			nzContent: UploadProductoComponent,
			nzWidth: '35%',
			nzFooter: null,
			nzStyle: {
				top: '25px',
			},
		});
		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadDataProducto();
			}
		});
	}
	searchTo() {
		this.page = 1;
		this.loadDataProducto();
	}

	onPageChange(page: number) {
		this.page = page;
		this.loadDataProducto();
	}

	descargarExcel(): void {
		this.reporteExcelService.descargarExcelProducto().subscribe({
			next: (blob: Blob) => {
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = 'reporte_productos.xlsx';
				link.click();
				window.URL.revokeObjectURL(url);
			},
			error: (error) => {
				this.message.error('Error al descargar el Excel');
				console.error('Error downloading Excel:', error);
			},
		});
	}

	downloadPDF(): void {
		this.reportePdfService.downloadProductosPDF().subscribe({
			next: (blob: Blob) => {
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = 'reporte_productos.pdf';
				link.click();
				window.URL.revokeObjectURL(url);
			},
			error: (error) => {
				this.message.error('Error al descargar el PDF');
				console.error('Error downloading PDF:', error);
			},
		});
	}
	refreshPage() {
		this.loadDataProducto();
	}
	deleteProducto(producto: Producto) {
		Swal.fire({
			title: '¿Está seguro?',
			text: `Este proceso no es reversible, está a punto de eliminar su producto , ${producto.nombre_producto}`,
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
				this._productoService.deleteProductoById(producto.id_producto).subscribe({
					next: () => {
						this.loadDataProducto();
						this.message.success('Producto eliminado con éxito');
					},
					error: () => {
						this.loading = false;
						this.message.error('Error al eliminar El producto');
					},
				});
			}
		});
	}
}
