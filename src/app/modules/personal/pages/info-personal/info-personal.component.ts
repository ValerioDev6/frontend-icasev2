import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportesPdfService } from '../../../../core/services/reports/reportes-pdf.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { PeruvianCurrencyPipe } from '../../../../shared/pipes/pipe-currency.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/fecha.pipe';
import { IClienteByIdDetallesResponse, TbVenta } from '../../../../core/interfaces/personal-by-id.interface';
import { PersonalService } from '../../../../core/services/personal.service';

@Component({
	selector: 'app-info-personal',
	standalone: true,
	imports: [CommonModule, NzSpinModule, NzIconModule, NzBreadCrumbModule, PeruvianCurrencyPipe, DateFormatPipe],
	templateUrl: './info-personal.component.html',
	styleUrl: './info-personal.component.scss',
})
export default class InfoPersonalComponent implements OnInit {
	personal!: IClienteByIdDetallesResponse;

	loading = true;
	isDownloading = false;

	ngOnInit() {
		this.loadingDataProducto();
	}

	calcularTotalVentas(ventas: TbVenta[]): number {
		return ventas.reduce((total, venta) => total + venta.precio_total, 0);
	}
	constructor(
		private readonly route: ActivatedRoute,
		private readonly _routes: Router,
		private readonly _personalService: PersonalService,
		private readonly _reportPdfService: ReportesPdfService,
		private readonly message: NzMessageService
	) {}

	private loadingDataProducto() {
		this.loading = false;
		this.route.params
			.pipe(
				switchMap((params) => {
					const id = params['id'];
					return this._personalService.getPersonalByIdDetalles(id);
				}),
				finalize(() => {
					this.loading = false;
				})
			)
			.subscribe({
				next: (resp) => {
					if (resp) {
						this.personal = resp;
					}
				},
			});
	}

	back() {
		this._routes.navigate(['/admin/personal']);
	}

	downloadPDF() {}
}
