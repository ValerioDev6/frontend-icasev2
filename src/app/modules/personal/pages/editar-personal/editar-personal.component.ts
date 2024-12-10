import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-editar-personal',
	standalone: true,
	imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule],
	templateUrl: './editar-personal.component.html',
	styleUrl: './editar-personal.component.scss',
})
export default class EditarPersonalComponent {
	profileForm: FormGroup;

	constructor(private fb: FormBuilder) {
		this.profileForm = this.fb.group({
			nombres: ['', Validators.required],
			apellidoPaterno: ['', Validators.required],
			apellidoMaterno: ['', Validators.required],
			genero: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			fechaNacimiento: ['', Validators.required],
			direccion: ['', Validators.required],
			pais: ['', Validators.required],
		});
	}

	onSubmit() {
		if (this.profileForm.valid) {
			console.log(this.profileForm.value);
			// Handle form submission
		}
	}
}
