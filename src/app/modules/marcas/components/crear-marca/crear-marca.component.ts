/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MarcasService } from '../../../../core/services/marcas.service';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { IMarcaSubmit } from '../../../../core/interfaces/marcas.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-crear-marca',
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
		NzDatePickerModule,
	],
	templateUrl: './crear-marca.component.html',
	styleUrl: './crear-marca.component.scss',
})
export class CrearMarcaComponent implements OnInit {
	marcaForm!: FormGroup;

	constructor(
		private readonly _marcasService: MarcasService,
		private modalRef: NzModalRef,
		private fb: FormBuilder,
		private message: NzMessageService
	) {}

	ngOnInit(): void {
		this.marcaForm = this.fb.group({
			nombre_marca: ['', [Validators.required, Validators.minLength(6)]],
			created_at: [null, [Validators.required]],
			estado: [true, [Validators.required]],
		});
	}
	get nombreMarcaControl() {
		return this.marcaForm.get('nombre_marca');
	}
	get dateControl() {
		return this.marcaForm.get('created_at');
	}
	get estadoControl() {
		return this.marcaForm.get('estado');
	}

	submitForm(): void {
		if (this.marcaForm.valid) {
			const marcaData: IMarcaSubmit = this.marcaForm.value;
			this._marcasService.createMarcas(marcaData).subscribe({
				next: (resp: any) => {
					this.message.success('Marca creada con éxito');
					this.modalRef.close(true);
				},
				error: (error: HttpErrorResponse) => this.handleCreateMarcaError(error),
			});
		} else {
			this.validateForm();
		}
	}

	private validateForm(): void {
		Object.values(this.marcaForm.controls).forEach((control) => {
			if (control.invalid) {
				control.markAsDirty();
				control.updateValueAndValidity({ onlySelf: true });
			}
		});
	}
	private handleCreateMarcaError(error: HttpErrorResponse): void {
		console.error('Error completo:', error);

		if (error.status === 400) {
			const errorMessage = error.error?.message || 'Error al crear la Marca';
			this.message.error(errorMessage);
		} else {
			this.message.error('Error al crear la marca. Por favor, inténtelo de nuevo.');
		}
	}
	cancelar(): void {
		this.modalRef.close();
	}
}
