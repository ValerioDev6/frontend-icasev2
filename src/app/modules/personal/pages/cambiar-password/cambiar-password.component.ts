import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PersonalService } from '../../../../core/services/personal.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/common/auth.service';
@Component({
	selector: 'app-cambiar-password',
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule, FormsModule, NzFormModule, NzInputModule, NzButtonModule, NzIconModule],
	templateUrl: './cambiar-password.component.html',
	styleUrl: './cambiar-password.component.scss',
})
export default class CambiarPasswordComponent implements OnInit {
	passwordForm!: FormGroup;
	showOldPassword = false;
	showNewPassword = false;
	showConfirmPassword = false;

	constructor(
		private fb: FormBuilder,
		private personalService: PersonalService,
		private authService: AuthService,
		private message: NzMessageService
	) {}

	ngOnInit() {
		this.initForm();
	}

	initForm() {
		this.passwordForm = this.fb.group(
			{
				oldPassword: ['', [Validators.required]],
				newPassword: [
					'',
					[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)],
				],
				confirmPassword: ['', [Validators.required]],
			},
			{
				validators: this.passwordMatchValidator,
			}
		);
	}

	passwordMatchValidator(g: FormGroup) {
		return g.get('newPassword')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
	}

	toggleOldPasswordVisibility() {
		this.showOldPassword = !this.showOldPassword;
	}

	toggleNewPasswordVisibility() {
		this.showNewPassword = !this.showNewPassword;
	}

	toggleConfirmPasswordVisibility() {
		this.showConfirmPassword = !this.showConfirmPassword;
	}

	onSubmit() {
		if (this.passwordForm.valid) {
			const { oldPassword, newPassword, confirmPassword } = this.passwordForm.value;

			this.personalService
				.changeCurrentUserPassword({
					currentPassword: oldPassword,
					newPassword: newPassword,
					confirmNewPassword: confirmPassword,
				})
				.subscribe({
					next: () => {
						Swal.fire({
							icon: 'success',
							title: 'Contraseña cambiada exitosamente',
							text: 'Por favor, inicia sesión nuevamente',
							confirmButtonText: 'Iniciar Sesión',
							allowOutsideClick: false,
						}).then((result) => {
							if (result.isConfirmed) {
								this.authService.logout();
							}
						});
					},
					error: (error) => {
						this.message.error(error.error?.message || 'Error al cambiar la contraseña');
					},
				});
		}
	}
}
