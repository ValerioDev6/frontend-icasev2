import { Component, OnInit } from '@angular/core';
import { IDetalleVentaResponseByID } from '../../../../core/interfaces/detalle-venta.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, switchMap } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CommonModule } from '@angular/common';
import { VentasService } from '../../../../core/services/ventas.service';
@Component({
	selector: 'app-venta-detalles',
	standalone: true,
	imports: [NzSpinModule, CommonModule, RouterLink],
	templateUrl: './venta-detalles.component.html',
	styleUrl: './venta-detalles.component.scss',
})
export default class VentaDetallesComponent implements OnInit {
	venta?: IDetalleVentaResponseByID;
	loading = false;

	constructor(
		private route: ActivatedRoute,
		private ventasService: VentasService
	) {}

	ngOnInit() {
		this.route.params
			.pipe(
				switchMap((params) => {
					const id = params['id'];
					return this.ventasService.getVentaById(id);
				}),
				finalize(() => {
					this.loading = false;
				})
			)
			.subscribe({
				next: (result) => {
					if (result) {
						this.venta = result;
					}
				},
			});
	}

	goBack() {}

	printVenta() {}
}
