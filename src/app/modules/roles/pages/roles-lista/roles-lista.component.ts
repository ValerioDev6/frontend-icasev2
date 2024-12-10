import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { IRolesResponse, Role } from '../../../../core/interfaces/roles.interface';
import { RolesService } from '../../../../core/services/roles.service';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import { CrearRolesComponent } from '../../components/crear-roles/crear-roles.component';
import Swal from 'sweetalert2';
import { ActualizaRolComponent } from '../../components/actualiza-rol/actualiza-rol.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

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
];
@Component({
	selector: 'app-roles-lista',
	standalone: true,

	imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, NZ_MODULES, NzModalModule],
	templateUrl: './roles-lista.component.html',
	styleUrl: './roles-lista.component.scss',
})
export default class RolesListaComponent implements OnInit {
	private readonly _rolesService = inject(RolesService);

	constructor(
		private readonly _modal: NzModalService,
		private readonly message: NzMessageService
	) {}
	roles: Role[] = [];
	loading = false;
	search: string = '';
	page: number = 1;
	limit: number = 5;
	total: number = 0;
	ngOnInit(): void {
		this.loadDataRoles();
	}

	loadDataRoles(): void {
		this.loading = true;
		this._rolesService.getRolesData(this.page, this.limit, this.search).subscribe({
			next: (response: IRolesResponse) => {
				this.roles = response.roles;
				this.total = response.info.total;
				this.loading = false;
				console.log(response);
			},
			error: (err) => {
				console.error('Error al cargar roles', err);
				this.loading = false;
			},
		});
	}

	searchTo() {
		this.page = 1;
		this.loadDataRoles();
	}

	onPageChange(page: number) {
		this.page = page;
		this.loadDataRoles();
	}

	openAgregarRolModal(): void {
		const modal = this._modal.create({
			nzTitle: 'Agregar Nuevo Rol',
			nzContent: CrearRolesComponent,
			nzFooter: null,
			nzWidth: '600px',
		});

		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadDataRoles();
			}
		});
	}

	openEditarModal(role: Role): void {
		const modal = this._modal.create({
			nzTitle: 'Editar Rol',
			nzContent: ActualizaRolComponent,
			nzData: { id_rol: role.id_rol },
			nzFooter: null,
			nzWidth: '600px',
		});

		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadDataRoles();
			}
		});
	}

	deleteRol(role: Role): void {
		Swal.fire({
			title: '¿Está seguro?',
			text: `Este proceso no es reversible, está a punto de eliminar su rol , ${role.nombre_rol}`,
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
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-16 h-16 text-red-500"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
		}).then((result) => {
			if (result.isConfirmed) {
				this.loading = true;
				this._rolesService.deleteRole(role.id_rol).subscribe({
					next: () => {
						this.loadDataRoles();
						this.message.success('roles eliminada con éxito');
					},
					error: () => {
						this.loading = false;
						this.message.error('Error al eliminar el Rol');
					},
				});
			}
		});
	}
}

// en huskyy npm test
