import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { Role } from '../../../../core/interfaces/roles.interface';
import { RolesService } from '../../../../core/services/roles.service';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';

interface ModalData {
	id_rol: string;
}

@Component({
	selector: 'app-actualiza-rol',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		NzButtonModule,
		NzInputModule,
		NzFormModule,
		NzIconModule,
		NzRadioModule,
		NzMessageModule,
	],
	templateUrl: './actualiza-rol.component.html',
	styleUrl: './actualiza-rol.component.scss',
})
export class ActualizaRolComponent implements OnInit {
	private readonly formBuilder = inject(FormBuilder);
	private readonly rolService = inject(RolesService);
	private readonly modalRef = inject(NzModalRef);
	private readonly data = inject<ModalData>(NZ_MODAL_DATA);
	private readonly message = inject(NzMessageService);

	role!: Role;

	formGroup = this.formBuilder.nonNullable.group({
		nombre_rol: ['', [Validators.required, Validators.minLength(3)]],
		descripcion: ['', [Validators.required, Validators.minLength(10)]],
		estado: [true, [Validators.required]],
	});

	ngOnInit(): void {
		if (this.data.id_rol) {
			this.rolService.getRoleById(this.data.id_rol).subscribe({
				next: (role: Role) => {
					this.role = role;
					this.formGroup.patchValue({
						nombre_rol: role.nombre_rol,
						descripcion: role.descripcion,
						estado: role.estado,
					});
				},
				error: (error) => {
					console.error('Error al cargar el rol', error);
				},
			});
		}
	}

	get nombreRolField(): FormControl<string> {
		return this.formGroup.controls.nombre_rol;
	}

	get descripcionRolField(): FormControl<string> {
		return this.formGroup.controls.descripcion;
	}

	get estadoRolField(): FormControl<boolean> {
		return this.formGroup.controls.estado;
	}

	onUpdateRol(): void {
		if (this.formGroup.valid && this.role) {
			if (!this.formGroup.dirty) {
				this.message.warning('No se han realizado cambios en el rol');
				return;
			}

			const updatedRole: Role = {
				...this.role,
				...this.formGroup.value,
			};
			this.rolService.updateRole(updatedRole).subscribe({
				next: () => {
					this.message.success('Rol actualizado correctamente');
					this.modalRef.close(true);
				},
				error: (error) => {
					console.error('Error al actualizar el rol', error);
					this.message.error('Error al actualizar el rol');
				},
			});
		} else {
			Object.values(this.formGroup.controls).forEach((control) => {
				if (control.invalid) {
					control.markAsDirty();
					control.updateValueAndValidity({ onlySelf: true });
				}
			});
			this.message.error('Por favor, corrija los errores en el formulario');
		}
	}

	cancelar(event?: Event): void {
		event?.preventDefault();
		this.modalRef.close(false);
	}
}
