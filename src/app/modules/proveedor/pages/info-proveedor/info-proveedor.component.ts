import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedoresService } from '../../../../core/services/proveedores.service';
import { ReportesPdfService } from '../../../../core/services/reports/reportes-pdf.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize, switchMap } from 'rxjs';
import { IProveedorByIDResponseIndividual } from '../../../../core/interfaces/proveedor-by-id.interface';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { PeruvianCurrencyPipe } from '../../../../shared/pipes/pipe-currency.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/fecha.pipe';

@Component({
	selector: 'app-info-proveedor',
	standalone: true,
	imports: [CommonModule, NzSpinModule, NzIconModule, NzBreadCrumbModule, PeruvianCurrencyPipe, DateFormatPipe],
	templateUrl: './info-proveedor.component.html',
	styleUrl: './info-proveedor.component.scss',
})
export default class InfoProveedorComponent implements OnInit {
	proveedor!: IProveedorByIDResponseIndividual;
	loading = true;
	isDownloading = false;

	ngOnInit() {
		this.loadingDataProducto();
	}

	constructor(
		private readonly route: ActivatedRoute,
		private readonly _routes: Router,
		private readonly proveedorService: ProveedoresService,
		private readonly _reportPdfService: ReportesPdfService,
		private readonly message: NzMessageService
	) {}

	private loadingDataProducto() {
		this.loading = false;
		this.route.params
			.pipe(
				switchMap((params) => {
					const id = params['id'];
					return this.proveedorService.getProveedorDetallesById(id);
				}),
				finalize(() => {
					this.loading = false;
				})
			)
			.subscribe({
				next: (resp) => {
					if (resp) {
						this.proveedor = resp;
					}
				},
			});
	}

	back() {
		this._routes.navigate(['/admin/proveedor']);
	}

	obtenerNombreMostrar(persona: IProveedorByIDResponseIndividual): string {
		if (persona.tb_personas.razon_social && persona.tb_personas.razon_social !== 'null') {
			return persona.tb_personas.razon_social;
		}

		// Devolver nombres directamente si están disponibles
		if (persona.tb_personas.nombres) {
			return persona.tb_personas.nombres;
		}

		// Si todo está vacío, mostrar valor por defecto
		return 'Sin nombre';
	}
	downloadPDF(): void {
		// this._reportPdfService.downloadProductDetalles(proveedor.id_proveedor).subscribe({
		// 	next: (blob: Blob) => {
		// 		const url = window.URL.createObjectURL(blob);
		// 		const link = document.createElement('a');
		// 		link.href = url;
		// 		link.download = 'reporte_producto.pdf';
		// 		link.click();
		// 		window.URL.revokeObjectURL(url);
		// 	},
		// 	error: (error) => {
		// 		this.message.error('Error al descargar el PDF');
		// 		console.error('Error downloading PDF:', error);
		// 	},
		// });
	}
}
