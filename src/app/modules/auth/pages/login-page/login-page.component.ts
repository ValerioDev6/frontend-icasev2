import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { AuthService } from '../../../../core/services/common/auth.service';
import Swal from 'sweetalert2';
import { EMPTY, catchError, finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-login-page',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		NzFormModule,
		NzInputModule,
		NzCheckboxModule,
		NzButtonModule,
		NzGridModule,
		NzIconModule,
		CommonModule,
	],
	templateUrl: './login-page.component.html',
	styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
	private readonly _authService = inject(AuthService);
	passwordVisible = false;
	isLoading = false;

	togglePasswordVisibility(): void {
		this.passwordVisible = !this.passwordVisible;
	}

	validateForm: FormGroup<{
		email: FormControl<string>;
		password: FormControl<string>;
		remember: FormControl<boolean>;
	}> = this.fb.group({
		email: ['valerio@gmail.com', [Validators.required, Validators.email]],
		password: ['valerio2003', [Validators.required]],
		remember: [true],
	});

	submitForm(): void {
		if (this.validateForm.valid) {
			this.isLoading = true;
			const { email, password } = this.validateForm.getRawValue();
			this._authService
				.login(email, password)
				.pipe(
					catchError((error: HttpErrorResponse) => {
						const errorMessage = error.message;
						this.showError(errorMessage);
						return EMPTY;
					}),
					finalize(() => {
						this.isLoading = false;
					})
				)
				.subscribe();
		} else {
			Object.values(this.validateForm.controls).forEach((control) => {
				if (control.invalid) {
					control.markAsDirty();
					control.updateValueAndValidity({ onlySelf: true });
				}
			});
		}
	}

	private showError(message: string): void {
		Swal.fire({
			icon: 'error',
			title: 'Error',
			text: message,
		});
	}

	constructor(private fb: NonNullableFormBuilder) {}
}
