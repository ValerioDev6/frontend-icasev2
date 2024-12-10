import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../../../core/services/categories.service';
import { ICategorySubmit } from '../../../../core/interfaces/categories.interface';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-crear-categorie',
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
	templateUrl: './crear-categorie.component.html',
	styleUrl: './crear-categorie.component.scss',
})
export class CrearCategorieComponent implements OnInit {
	categoriaForm!: FormGroup;
	constructor(
		private readonly _categorieService: CategoriesService,
		private modalRef: NzModalRef,
		private fb: FormBuilder,
		private message: NzMessageService
	) {}

	ngOnInit(): void {
		this.categoriaForm = this.fb.group({
			nombre_cat: ['', [Validators.required, Validators.minLength(3)]],
			created_at: [null, [Validators.required]],
			estado: [true, [Validators.required]],
		});
	}

	get nombreCategoriaControl() {
		return this.categoriaForm.get('nombre_cat');
	}
	get dateControl() {
		return this.categoriaForm.get('created_at');
	}
	get estadoControl() {
		return this.categoriaForm.get('estado');
	}

	guardarCategorie(): void {
		if (this.categoriaForm.valid) {
			const categoriaData: ICategorySubmit = this.categoriaForm.value;
			this._categorieService.createCategorias(categoriaData).subscribe({
				next: () => {
					this.message.success('Categoria creada exitosamente');
					this.modalRef.close(true);
				},
				error: (error: HttpErrorResponse) => this.handleCreateMarcaError(error),
			});
		} else {
			this.validateForm();
		}
	}

	cancelar(): void {
		this.modalRef.close();
	}

	private validateForm(): void {
		Object.values(this.categoriaForm.controls).forEach((control) => {
			if (control.invalid) {
				control.markAsDirty();
				control.updateValueAndValidity({ onlySelf: true });
			}
		});
	}

	private handleCreateMarcaError(error: HttpErrorResponse): void {
		console.error('Error completo:', error);

		if (error.status === 400) {
			const errorMessage = error.error?.message || 'Error al crear la categoría';
			this.message.error(errorMessage);
		} else {
			this.message.error('Error al crear la categoría. Por favor, inténtelo de nuevo.');
		}
	}
}
