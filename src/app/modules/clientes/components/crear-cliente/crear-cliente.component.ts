/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { RouterModule } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { PersonasService } from '../../../../core/services/personas.service';
import { forkJoin } from 'rxjs';
import { ITipoPersonaClienteCombo } from '../../../../core/interfaces/personas.interface';
import { PersonaFormularioComponent } from '../../../../shared/components/persona-formulario/persona-formulario.component';
import { ClienteService } from '../../../../core/services/cliente.service';

@Component({
	selector: 'app-crear-cliente',
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
		NzFormModule,
		NzSpinModule,
		NzSelectModule,
	],
	templateUrl: './crear-cliente.component.html',
	styleUrl: './crear-cliente.component.scss',
})
export class CrearClienteComponent implements OnInit {
	private readonly _clienteService = inject(ClienteService);
	private readonly _personasService = inject(PersonasService);
	tipoPersonasCliente: ITipoPersonaClienteCombo[] = [];

	clienteForm!: FormGroup;
	loading = true;

	ngOnInit(): void {
		this.loadData();
	}
	// Opciones para enums
	estadosCliente = [
		{ label: 'Activo', value: 1 },
		{ label: 'Inactivo', value: 0 },
	];

	clasificacionesCliente = [
		{ label: 'A', value: 'A' },
		{ label: 'B', value: 'B' },
		{ label: 'C', value: 'C' },
	];

	tiposCliente = [
		{ label: 'Recurrente', value: 'RECURRENTE' },
		{ label: 'Casual', value: 'CASUAL' },
		{ label: 'VIP', value: 'VIP' },
		{ label: 'Corporativo', value: 'CORPORATIVO' },
	];

	constructor(
		private modalRef: NzModalRef,
		private readonly fb: FormBuilder,
		private readonly message: NzMessageService,
		private readonly _modal: NzModalService
	) {
		this.clienteForm = this.fb.group({
			id_persona: ['', Validators.required],
			tipo_cliente: ['CASUAL', Validators.required],
			estado: [1, Validators.required],
			clasificacion: ['C', Validators.required],
			observaciones: [''],
		});
	}

	private loadData() {
		this.loading = true;
		forkJoin({
			tipoPersonasCliente: this._personasService.getPersonasByCliente(),
		}).subscribe({
			next: (result) => {
				this.tipoPersonasCliente = result.tipoPersonasCliente;
				this.loading = false;
			},
			error: (error) => {
				this.message.error(error);
			},
		});
	}

	onSubmit() {
		if (this.clienteForm.valid) {
			const clienteData = this.clienteForm.value;
			this._clienteService.createPersonal(clienteData).subscribe({
				next: () => {
					this.message.success('Cliente Creado exitosamente');
					this.modalRef.close(true);
					this.resetForm();
				},
				error: (err) => {
					console.log('Error save proveedo', err);
				},
			});
		}
	}
	openPersonaModal() {
		const modal = this._modal.create({
			nzFooter: null,
			nzContent: PersonaFormularioComponent,
			nzWidth: '1000px',
			nzStyle: {
				top: '10px',
			},
		});
		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadData();
			}
		});
	}

	cancelar(): void {
		this.modalRef.close();
	}

	resetForm() {
		this.clienteForm.reset();
	}
}
