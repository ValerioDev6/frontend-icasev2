/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { finalize } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { VentasService } from '../../../../core/services/ventas.service';
import { Resumen, VentaDetalle } from '../../../../core/interfaces/ventas-detalle.interface';
interface ModalData {
	id_venta: string;
}
@Component({
	selector: 'app-table-producto-venta-modal',
	standalone: true,
	imports: [CommonModule, NzSpinModule, NzTableModule, NzButtonModule, FormsModule, NzPaginationModule],
	templateUrl: './table-producto-venta-modal.component.html',
	styleUrl: './table-producto-venta-modal.component.scss',
})
export class TableProductoVentaModalComponent implements OnInit {
	private ventasService = inject(VentasService);
	private modalRef = inject(NzModalRef);
	private readonly data = inject<ModalData>(NZ_MODAL_DATA);

	detalles: VentaDetalle[] = [];
	loading = false;
	total = 0;
	page = 1;
	pageSize = 5;
	resumen?: Resumen;

	ngOnInit() {
		this.loadDetallesCompra();
	}

	loadDetallesCompra(page: number = 1) {
		this.loading = true;
		this.ventasService
			.getVentasDetallesData(this.data.id_venta, page, this.pageSize)
			.pipe(
				finalize(() => {
					this.loading = false;
				})
			)
			.subscribe({
				next: (response) => {
					this.detalles = response.detalles;
					this.total = response.info.total;
					this.resumen = response.resumen;
				},
				error: (err) => {
					console.error('Error al cargar detalles:', err);
				},
			});
	}
	onPageChange(page: number) {
		this.page = page;
		this.loadDetallesCompra(page);
	}

	closeModal() {
		this.modalRef.close();
	}
}
