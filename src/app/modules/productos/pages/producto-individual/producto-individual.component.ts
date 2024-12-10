/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { IProductoByIDResponse } from '../../../../core/interfaces/producto.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../../../core/services/productos.service';
import { finalize, switchMap } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CommonModule } from '@angular/common';
import { PeruvianCurrencyPipe } from '../../../../shared/pipes/pipe-currency.pipe';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { ReportesPdfService } from '../../../../core/services/reports/reportes-pdf.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
	selector: 'app-producto-individual',
	standalone: true,
	imports: [
		NzButtonModule,
		PeruvianCurrencyPipe,
		NgxBarcode6Module,
		NzIconModule,
		CommonModule,
		NzBreadCrumbModule,
		NzSpinModule,
	],
	templateUrl: './producto-individual.component.html',
	styleUrl: './producto-individual.component.scss',
})
export default class ProductoIndividualComponent implements OnInit {
	producto!: IProductoByIDResponse;
	loading = true;
	isDownloading = false;

	ngOnInit() {
		this.loadingDataProducto();
	}

	constructor(
		private readonly route: ActivatedRoute,
		private readonly _routes: Router,
		private readonly productoService: ProductoService,
		private readonly _reportPdfService: ReportesPdfService,
		private readonly message: NzMessageService
	) {}

	private loadingDataProducto() {
		this.loading = false;
		this.route.params
			.pipe(
				switchMap((params) => {
					const id = params['id'];
					return this.productoService.getProductoDetallesById(id);
				}),
				finalize(() => {
					this.loading = false;
				})
			)
			.subscribe({
				next: (resp) => {
					if (resp) {
						this.producto = resp;
					}
				},
			});
	}

	back() {
		this._routes.navigate(['/admin/productos']);
	}

	edit() {
		if (this.producto?.id_producto) {
			this._routes.navigate(['/admin/productos/actualizar', this.producto.id_producto]);
		}
	}
	downloadPDF(producto: IProductoByIDResponse): void {
		this._reportPdfService.downloadProductDetalles(producto!.id_producto).subscribe({
			next: (blob: Blob) => {
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = 'reporte_producto.pdf';
				link.click();
				window.URL.revokeObjectURL(url);
			},
			error: (error) => {
				this.message.error('Error al descargar el PDF');
				console.error('Error downloading PDF:', error);
			},
		});
	}
}
