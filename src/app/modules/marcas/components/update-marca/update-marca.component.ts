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
import { MarcasService } from '../../../../core/services/marcas.service';
import { Marca } from '../../../../core/interfaces/marcas.interface';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

interface ModalData {
	id_marca: string;
}

@Component({
	selector: 'app-update-marca',
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
	templateUrl: './update-marca.component.html',
	styleUrl: './update-marca.component.scss',
})
export class UpdateMarcaComponent implements OnInit {
	private readonly formBuilder = inject(FormBuilder);
	private readonly marcaService = inject(MarcasService);
	private readonly modalRef = inject(NzModalRef);
	private readonly data = inject<ModalData>(NZ_MODAL_DATA);
	private readonly message = inject(NzMessageService);

	marca!: Marca;
	formGroup = this.formBuilder.nonNullable.group({
		nombre_marca: ['', [Validators.required, Validators.minLength(3)]],
		created_at: [new Date(), [Validators.required]],
		estado: [true, [Validators.required]],
	});

	ngOnInit(): void {
		if (this.data.id_marca) {
			this.marcaService.getMarcaById(this.data.id_marca).subscribe({
				next: (marca: Marca) => {
					this.marca = marca;
					this.formGroup.patchValue({
						nombre_marca: marca.nombre_marca,
						created_at: marca.created_at,
						estado: marca.estado,
					});
				},
				error: (error) => {
					console.error('Error al cargar el rol', error);
				},
			});
		}
	}

	get nombreMarcaField(): FormControl<string> {
		return this.formGroup.controls.nombre_marca;
	}

	get fechaMarcaField(): FormControl<Date> {
		return this.formGroup.controls.created_at;
	}

	get estadoMarcaField(): FormControl<boolean> {
		return this.formGroup.controls.estado;
	}

	onUpdateRol(): void {
		if (this.formGroup.valid && this.marca) {
			if (!this.formGroup.dirty) {
				this.message.warning('No se han realizado cambios en la marca');
				return;
			}

			const updatedMarca: Marca = {
				...this.marca,
				...this.formGroup.value,
			};
			this.marcaService.updateMarca(updatedMarca).subscribe({
				next: () => {	
					this.message.success('Marca  actualizada correctamente');
					this.modalRef.close(true);
				},
				error: (error) => {
					console.error('Error al actualizar la marca', error);
				},
			});
		} else {
			Object.values(this.formGroup.controls).forEach((control) => {
				if (control.invalid) {
					control.markAsDirty();
					control.updateValueAndValidity({ onlySelf: true });
				}
			});
		}
	}

	cancelar(): void {
		this.modalRef.close(false);
	}
}
