import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { PersonasService } from '../../../../core/services/personas.service';
import { forkJoin } from 'rxjs';
import { ITipoPersonaClienteCombo, ITipoPersonaProveedorCombo } from '../../../../core/interfaces/personas.interface';
import { ClienteService } from '../../../../core/services/cliente.service';
import { Cliente } from '../../../../core/interfaces/cliente.interface';
interface ModalData {
	id_cliente: string;
}
@Component({
	selector: 'app-editar-cliente',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		NzSpinModule,
		NzFormModule,
		NzInputModule,
		NzSelectModule,
		NzButtonModule,
		NzIconModule,
		NzMessageModule,
	],
	templateUrl: './editar-cliente.component.html',
	styleUrl: './editar-cliente.component.scss',
})
export class EditarClienteComponent implements OnInit {
	private readonly formBuilder = inject(FormBuilder);
	private readonly _clienteService = inject(ClienteService);
	private readonly _personasService = inject(PersonasService);
	tipoPersonasCliente: ITipoPersonaClienteCombo[] = [];

	private readonly modalRef = inject(NzModalRef);
	private readonly data = inject<ModalData>(NZ_MODAL_DATA);
	private readonly message = inject(NzMessageService);
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

	isLoading = true;
	cliente!: Cliente;

	formGroup = this.formBuilder.nonNullable.group({
		id_persona: ['', Validators.required],
		tipo_cliente: ['CASUAL', Validators.required],
		estado: [1, Validators.required],
		clasificacion: ['C', Validators.required],
		observaciones: [''],
	});

	ngOnInit() {
		this.isLoading = true;
		this.loadData();
		if (this.data.id_cliente) {
			this._clienteService.getClienteById(this.data.id_cliente).subscribe({
				next: (cliente: Cliente) => {
					this.cliente = cliente;
					this.formGroup.patchValue({
						id_persona: cliente.id_persona,
						estado: cliente.estado,
						tipo_cliente: cliente.tipo_cliente,
						clasificacion: cliente.clasificacion,
						observaciones: cliente.observaciones,
					});
				},
				error: (error) => {
					console.log('Errorr al cargar el cliente', error);
				},
			});
		}
	}

	private loadData() {
		this.isLoading = true;
		forkJoin({
			tipoPersonalCLiente: this._personasService.getPersonasByCliente(),
		}).subscribe({
			next: (result) => {
				this.tipoPersonasCliente = result.tipoPersonalCLiente;
				this.isLoading = false;
			},
			error: (error) => {
				this.message.error(error);
				this.isLoading = false;
			},
		});
	}

	onUpdateProveedor(): void {
		if (this.formGroup.valid && this.cliente) {
			if (!this.formGroup.dirty) {
				this.message.warning('No se han realizado cambios en el cliente');
				return;
			}

			const updateCliente: Cliente = {
				...this.cliente,
				...this.formGroup.value,
			};
			this._clienteService.updatePersonal(updateCliente).subscribe({
				next: () => {
					this.message.success('Cliente  actualizada correctamente');
					this.modalRef.close(true);
				},
				error: () => {
					console.error('Error al actualizar el cliente');
				},
			});
		} else {
			this.validateForm();
		}
	}

	private validateForm(): void {
		Object.values(this.formGroup.controls).forEach((control) => {
			if (control.invalid) {
				control.markAsDirty();
				control.updateValueAndValidity({ onlySelf: true });
			}
		});
	}
	obtenerNombreMostrar(persona: ITipoPersonaProveedorCombo): string {
		if (persona.razon_social && persona.razon_social !== 'null') {
			return persona.razon_social;
		}

		if (persona.nombre_completo && persona.nombre_completo !== 'null') {
			return persona.nombre_completo;
		}

		return 'Sin nombre';
	}
	cancelar(): void {
		this.modalRef.close();
	}
}
