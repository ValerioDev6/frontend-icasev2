/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ComprasService } from '../../../../core/services/compras.service';
import { DetalleCompra, Resumen } from '../../../../core/interfaces/compras-detalles.interface';
import { finalize } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
interface ModalData {
	id_compra: string;
}

@Component({
	selector: 'app-table-compras-modal',
	standalone: true,
	imports: [CommonModule, NzSpinModule, NzTableModule, NzButtonModule, FormsModule, NzPaginationModule],
	templateUrl: './table-compras-modal.component.html',
	styleUrl: './table-compras-modal.component.scss',
})
export class TableComprasModalComponent implements OnInit {
	private comprasService = inject(ComprasService);
	private modalRef = inject(NzModalRef);
	private readonly data = inject<ModalData>(NZ_MODAL_DATA);

	detalles: DetalleCompra[] = [];
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
		this.comprasService
			.getComprasDetallesData(this.data.id_compra, page, this.pageSize)
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
