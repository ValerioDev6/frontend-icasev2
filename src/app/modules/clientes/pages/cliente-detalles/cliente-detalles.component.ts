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
import { IClienteByIDResponse } from '../../../../core/interfaces/cliente-by-id.interface';
import { ClienteService } from '../../../../core/services/cliente.service';
@Component({
	selector: 'app-cliente-detalles',
	standalone: true,
	imports: [CommonModule, NzSpinModule, NzIconModule, NzBreadCrumbModule, PeruvianCurrencyPipe, DateFormatPipe],
	templateUrl: './cliente-detalles.component.html',
	styleUrl: './cliente-detalles.component.scss',
})
export default class ClienteDetallesComponent implements OnInit {
	cliente!: IClienteByIDResponse;
	loading = true;
	isDownloading = false;

	ngOnInit() {
		this.loadingDataProducto();
	}

	constructor(
		private readonly route: ActivatedRoute,
		private readonly _routes: Router,
		private readonly clienteService: ClienteService,
		private readonly _reportPdfService: ReportesPdfService,
		private readonly message: NzMessageService
	) {}

	private loadingDataProducto() {
		this.loading = false;
		this.route.params
			.pipe(
				switchMap((params) => {
					const id = params['id'];
					return this.clienteService.getClienteIdDetalle(id);
				}),
				finalize(() => {
					this.loading = false;
				})
			)
			.subscribe({
				next: (resp) => {
					if (resp) {
						this.cliente = resp;
					}
				},
			});
	}

	back() {
		this._routes.navigate(['/admin/cliente']);
	}
}
