import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { RouterModule } from '@angular/router';
import { PersonalService } from '../../../../core/services/personal.service';
import { IPersonalResponse, Personal } from '../../../../core/interfaces/personal.interface';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import CreatePersonalComponent from '../create-personal/create-personal.component';
import Swal from 'sweetalert2';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ChangePasswordPersonalComponent } from '../../components/change-password-personal/change-password-personal.component';

@Component({
	selector: 'app-personal-list',
	standalone: true,
	imports: [
		CommonModule,
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
		FormsModule,
		NzDropDownModule,
		NzDividerModule,
		NzCardModule,
		NzTagModule,
		NzIconModule,
		NzBreadCrumbModule,
		NzModalModule,
		NzMessageModule,
		NzSpinModule,
	],
	templateUrl: './personal-list.component.html',
	styleUrl: './personal-list.component.scss',
})
export default class PersonalListComponent implements OnInit {
	private readonly _personalService = inject(PersonalService);
	private readonly message = inject(NzMessageService);

	constructor(private readonly _modal: NzModalService) {}
	personal: Personal[] = [];
	loading = false;
	search: string = '';
	page: number = 1;
	limit: number = 10;
	total: number = 0;

	ngOnInit(): void {
		this.loadDataPersonal();
	}

	loadDataPersonal(): void {
		this.loading = true;
		this._personalService.getPersonalData(this.page, this.limit, this.search).subscribe({
			next: (response: IPersonalResponse) => {
				this.personal = response.personal;
				this.total = response.info.total;
				this.loading = false;
			},
			error: (err) => {
				console.error('Error al cargar datos personales', err);
				this.loading = false;
			},
		});
	}
	openAgregarPersonalModal() {
		const modal = this._modal.create({
			nzTitle: 'Agregar nuevo Personal',
			nzContent: CreatePersonalComponent,
			nzFooter: null,
			nzStyle: {
				top: '10px',
			},
		});

		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadDataPersonal();
			}
		});
	}
	openCambiarPasswordPersonalModal(personal: Personal) {
		const modal = this._modal.create({
			nzTitle: 'Cambiar Contraseña del Personal',
			nzContent: ChangePasswordPersonalComponent,
			nzFooter: null,
			nzData: {
				id_personal: personal.id_personal,
			},
			nzStyle: {
				top: '10px',
			},
		});

		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadDataPersonal();
			}
		});
	}

	searchTo(): void {
		this.page = 1;
		this.loadDataPersonal();
	}

	onPageChange(page: number): void {
		this.page = page;
		this.loadDataPersonal();
	}
	deletePersonal(personal: Personal): void {
		Swal.fire({
			title: '¿Está seguro?',
			text: `Este proceso no es reversible, está a punto de eliminar su personal , ${personal.tb_personas.nombres}`,
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
				this._personalService.deletePersonalById(personal.id_personal).subscribe({
					next: () => {
						this.loadDataPersonal();
						this.message.success('Personal eliminado con éxito');
					},
					error: () => {
						this.loading = false;
						this.message.error('Error al eliminar el personal');
					},
				});
			}
		});
	}
}
