import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ComprasService } from '../../../../core/services/compras.service';
import { finalize, switchMap } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { ReportesPdfService } from '../../../../core/services/reports/reportes-pdf.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IDetalleCompraResponse } from '../../../../core/interfaces/detalle-compra.interface';
import { PeruvianCurrencyPipe } from '../../../../shared/pipes/pipe-currency.pipe';

@Component({
	selector: 'app-compra-detalles',
	standalone: true,
	imports: [NzSpinModule, CommonModule, RouterLink, NzIconModule, NzBreadCrumbModule, PeruvianCurrencyPipe],
	templateUrl: './compra-detalles.component.html',
	styleUrl: './compra-detalles.component.scss',
})
export default class CompraDetallesComponent implements OnInit {
	compra?: IDetalleCompraResponse;
	loading = false;
	isDownloading = false;

	constructor(
		private route: ActivatedRoute,
		private comprasService: ComprasService,
		private readonly _routes: Router,
		private readonly _reportPdfService: ReportesPdfService,
		private readonly message: NzMessageService
	) {}

	ngOnInit() {
		this.route.params
			.pipe(
				switchMap((params) => {
					const id = params['id'];
					return this.comprasService.getCompraById(id);
				}),
				finalize(() => {
					this.loading = false;
				})
			)
			.subscribe({
				next: (result) => {
					if (result) {
						this.compra = result;
						console.log(result);
					}
				},
			});
	}

	back() {
		this._routes.navigate(['/admin/compras']);
	}

	downloadPDF(compra: IDetalleCompraResponse | undefined): void {
		this._reportPdfService.dowLoadCompraDetalles(compra!.id_compra).subscribe({
			next: (blob: Blob) => {
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = 'reporte_compra.pdf';
				link.click();
				window.URL.revokeObjectURL(url);
			},
			error: (error) => {
				this.message.error('Error al descargar el PDF');
				console.error('Error downloading PDF:', error);
			},
		});
	}

	printCompra() {}
}
