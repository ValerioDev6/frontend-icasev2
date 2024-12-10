import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';

import { NzMessageService } from 'ng-zorro-antd/message';
import { IRoleSubmit } from '../../../../core/interfaces/roles.interface';
import { RolesService } from '../../../../core/services/roles.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-crear-roles',
	standalone: true,
	imports: [
		CommonModule,
		NzButtonModule,
		NzInputModule,
		NzFormModule,
		NzIconModule,
		ReactiveFormsModule,
		FormsModule,
		NzRadioModule,
	],
	templateUrl: './crear-roles.component.html',
	styleUrl: './crear-roles.component.scss',
})
export class CrearRolesComponent implements OnInit {
	rolForm!: FormGroup;

	constructor(
		private readonly _rolService: RolesService,
		private modalRef: NzModalRef,
		private fb: FormBuilder,
		private message: NzMessageService
	) {}
	ngOnInit(): void {
		this.rolForm = this.fb.group({
			nombre_rol: ['', [Validators.required, Validators.minLength(6)]],
			descripcion: ['', [Validators.required, Validators.minLength(6)]],
			estado: [true, [Validators.required]],
		});
	}

	get nombreRolControl() {
		return this.rolForm.get('nombre_rol');
	}
	get descripcionControl() {
		return this.rolForm.get('descripcion');
	}
	get estadoControl() {
		return this.rolForm.get('estado');
	}

	guardarRol(): void {
		if (this.rolForm.valid) {
			const roleData: IRoleSubmit = this.rolForm.value;
			this._rolService.createRoles(roleData).subscribe({
				next: () => {
					this.message.success('Rol creado exitosamente');
					this.modalRef.close(true);
				},
				error: (err) => {
					console.error('Error al crear el rol', err);
				},
			});
		} else {
			Object.values(this.rolForm.controls).forEach((control) => {
				if (control.invalid) {
					control.markAsDirty();
					control.updateValueAndValidity({ onlySelf: true });
				}
			});
		}
	}

	cancelar(event?: Event): void {
		if (event) {
			event.preventDefault();
		}
		this.modalRef.close();
	}
}
