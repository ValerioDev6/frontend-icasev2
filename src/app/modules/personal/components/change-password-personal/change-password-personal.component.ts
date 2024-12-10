import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PersonalService } from '../../../../core/services/personal.service';

@Component({
	selector: 'app-change-password-personal',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule],
	providers: [NzModalService],
	template: `
		<form nz-form [formGroup]="changePasswordForm" (ngSubmit)="submitForm()">
			<nz-form-item>
				<nz-form-label>Contraseña Actual</nz-form-label>
				<nz-form-control nzErrorTip="Por favor ingrese su contraseña actual">
					<input nz-input formControlName="currentPassword" type="password" placeholder="Ingrese contraseña actual" />
				</nz-form-control>
			</nz-form-item>

			<nz-form-item>
				<nz-form-label>Nueva Contraseña</nz-form-label>
				<nz-form-control nzErrorTip="La contraseña debe tener al menos 6 caracteres, una letra y un número">
					<input nz-input formControlName="newPassword" type="password" placeholder="Ingrese nueva contraseña" />
				</nz-form-control>
			</nz-form-item>

			<nz-form-item>
				<nz-form-label>Confirmar Nueva Contraseña</nz-form-label>
				<nz-form-control nzErrorTip="Las contraseñas no coinciden">
					<input
						nz-input
						formControlName="confirmNewPassword"
						type="password"
						placeholder="Confirme nueva contraseña"
					/>
				</nz-form-control>
			</nz-form-item>

			<nz-form-item>
				<button
					nz-button
					nzType="primary"
					type="submit"
					[nzLoading]="isLoading"
					[disabled]="changePasswordForm.invalid"
				>
					Cambiar Contraseña
				</button>
			</nz-form-item>
		</form>
	`,
})
export class ChangePasswordPersonalComponent implements OnInit {
	changePasswordForm!: FormGroup;
	isLoading = false;
	personalId: string;

	constructor(
		private fb: FormBuilder,
		private personalService: PersonalService,
		private modalRef: NzModalRef,
		private message: NzMessageService
	) {
		// Obtener el ID pasado desde el modal
		this.personalId = this.modalRef.getConfig().nzData?.id_personal;
	}

	ngOnInit() {
		this.initForm();
	}

	initForm() {
		this.changePasswordForm = this.fb.group(
			{
				currentPassword: ['', [Validators.required, Validators.minLength(6)]],
				newPassword: [
					'',
					[Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)],
				],
				confirmNewPassword: ['', [Validators.required, Validators.minLength(6)]],
			},
			{
				validators: this.passwordMatchValidator,
			}
		);
	}

	// Validador personalizado para comparar contraseñas
	passwordMatchValidator(group: FormGroup) {
		const newPassword = group.get('newPassword');
		const confirmNewPassword = group.get('confirmNewPassword');

		return newPassword && confirmNewPassword && newPassword.value === confirmNewPassword.value
			? null
			: { passwordMismatch: true };
	}

	submitForm() {
		if (this.changePasswordForm.valid) {
			this.isLoading = true;

			const { currentPassword, newPassword, confirmNewPassword } = this.changePasswordForm.value;

			this.personalService
				.changeUserPasswordById(this.personalId, {
					currentPassword,
					newPassword,
					confirmNewPassword,
				})
				.subscribe({
					next: () => {
						this.message.success('Contraseña cambiada exitosamente');
						this.modalRef.close(true);
						this.isLoading = false;
					},
					error: (error) => {
						this.message.error(error.error?.message || 'Error al cambiar la contraseña');
						this.isLoading = false;
					},
				});
		}
	}
}
