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
import { NzSpaceModule } from 'ng-zorro-antd/space';
import Swal from 'sweetalert2';
import { ClienteService } from '../../../../core/services/cliente.service';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Cliente, IClienteResponse } from '../../../../core/interfaces/cliente.interface';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CrearClienteComponent } from '../../components/crear-cliente/crear-cliente.component';
import { EditarClienteComponent } from '../../components/editar-cliente/editar-cliente.component';
@Component({
	selector: 'app-clientes-lista',
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
		NzTagModule,
		NzModalModule,
	],
	templateUrl: './clientes-lista.component.html',
	styleUrl: './clientes-lista.component.scss',
})
export default class ClientesListaComponent implements OnInit {
	constructor(
		private readonly _clienteService: ClienteService,
		private readonly message: NzMessageService,
		private readonly _modal: NzModalService
	) {}
	clientes: Cliente[] = [];
	loading = false;
	search: string = '';
	page: number = 1;
	limit: number = 10;
	total: number = 0;

	ngOnInit(): void {
		this.loadDataCliente();
	}

	loadDataCliente() {
		this.loading = true;
		this._clienteService.getClienteData(this.page, this.limit, this.search).subscribe({
			next: (resposne: IClienteResponse) => {
				this.clientes = resposne.cliente;
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
		this.loadDataCliente();
	}
	onPageChange(page: number) {
		this.page = page;
		this.loadDataCliente();
	}
	openAgregarClienteModal() {
		const modal = this._modal.create({
			nzTitle: 'Agregar nuevo Cliente',
			nzContent: CrearClienteComponent,
			nzFooter: null,
			nzStyle: {
				top: '10px',
			},
		});

		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadDataCliente();
			}
		});
	}
	openEditarModal(cliente: Cliente) {
		const modal = this._modal.create({
			nzTitle: 'Editar  Cliente',
			nzContent: EditarClienteComponent,
			nzData: { id_cliente: cliente.id_cliente },
			nzFooter: null,
			nzStyle: {
				top: '10px',
			},
		});

		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadDataCliente();
			}
		});
	}

	deleteCliente(cliente: Cliente) {
		Swal.fire({
			title: '¿Está seguro?',
			text: `Este proceso no es reversible, está a punto de eliminar su cliente`,
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
				this._clienteService.deleteClienteById(cliente.id_cliente).subscribe({
					next: () => {
						this.loadDataCliente();
						this.message.success('Cliente eliminado con éxito');
					},
					error: () => {
						this.loading = false;
						this.message.error('Error al eliminar el Cliente');
					},
				});
			}
		});
	}
}
