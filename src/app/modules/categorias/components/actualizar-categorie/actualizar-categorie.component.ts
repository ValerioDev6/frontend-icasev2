import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CategoriesService } from '../../../../core/services/categories.service';
import { Category } from '../../../../core/interfaces/categories.interface';
import { HttpErrorResponse } from '@angular/common/http';

interface ModalData {
	id_categoria: string;
}
@Component({
	selector: 'app-actualizar-categorie',
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
		NzDatePickerModule,
	],
	templateUrl: './actualizar-categorie.component.html',
	styleUrl: './actualizar-categorie.component.scss',
})
export class ActualizarCategorieComponent implements OnInit {
	private readonly formBuilder = inject(FormBuilder);
	private readonly _categoriasService = inject(CategoriesService);
	private readonly modalRef = inject(NzModalRef);
	private readonly data = inject<ModalData>(NZ_MODAL_DATA);
	private readonly message = inject(NzMessageService);

	categorias!: Category;

	formGroup = this.formBuilder.nonNullable.group({
		nombre_cat: ['', [Validators.required, Validators.minLength(3)]],
		created_at: [new Date(), [Validators.required]],
		estado: [true, [Validators.required]],
	});

	get nombreMarcaField(): FormControl<string> {
		return this.formGroup.controls.nombre_cat;
	}

	get fechaMarcaField(): FormControl<Date> {
		return this.formGroup.controls.created_at;
	}

	get estadoMarcaField(): FormControl<boolean> {
		return this.formGroup.controls.estado;
	}

	ngOnInit(): void {
		if (this.data.id_categoria) {
			this._categoriasService.getCategoriasById(this.data.id_categoria).subscribe({
				next: (category: Category) => {
					this.categorias = category;
					this.formGroup.patchValue({
						nombre_cat: category.nombre_cat,
						created_at: category.created_at,
						estado: category.estado,
					});
				},
				error: (error) => {
					console.error('Error al cargar el rol', error);
				},
			});
		}
	}

	onUpdateCategoria(): void {
		if (this.formGroup.valid && this.categorias) {
			if (!this.formGroup.dirty) {
				this.message.warning('No se han realizado cambios en la Categorias');
				return;
			}

			const updatedCategorie: Category = {
				...this.categorias,
				...this.formGroup.value,
			};
			this._categoriasService.updateMarca(updatedCategorie).subscribe({
				next: () => {
					this.message.success('Categoria  actualizada correctamente');
					this.modalRef.close(true);
				},
				error: (error) => {
					console.error('Error al actualizar la categoría', error);
					this.handleUpdateCategoriaError(error);
				},
			});
		} else {
			this.validateForm();
		}
	}
	cancelar(): void {
		this.modalRef.close(false);
	}

	private validateForm(): void {
		Object.values(this.formGroup.controls).forEach((control) => {
			if (control.invalid) {
				control.markAsDirty();
				control.updateValueAndValidity({ onlySelf: true });
			}
		});
	}

	private handleUpdateCategoriaError(error: HttpErrorResponse): void {
		console.error('Error completo:', error);

		if (error.status === 400) {
			const errorMessage = error.error?.message || 'Error al actualizar la categoría';
			// Mostrar el mensaje específico del backend (por ejemplo, "El nombre de la categoría ya existe")
			this.message.error(errorMessage);
		} else {
			this.message.error('Error al actualizar la categoría. Por favor, inténtelo de nuevo.');
		}
	}
}
