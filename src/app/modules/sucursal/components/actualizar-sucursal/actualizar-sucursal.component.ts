import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SucursalService } from '../../../../core/services/sucursales.service';
import { Sucursale } from '../../../../core/interfaces/sucursales.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { PaisService } from '../../../../core/services/pais.service';
import { DireccionService } from '../../../../core/services/direccion.service';
import { forkJoin } from 'rxjs';
import { TipoTelefonoService } from '../../../../core/services/tipo-telefono.service';
import { IComboBoxDireccion } from '../../../../core/interfaces/direcciones.interface';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterLink } from '@angular/router';
import { ITelefonoCombo } from '../../../../core/interfaces/tipo-telefono.inteface';
import { IPaisCombo } from '../../../../core/interfaces/pais.interface';
interface ModalData {
	id_sucursal: string;
}

@Component({
	selector: 'app-actualizar-sucursal',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		NzSpinModule,
		NzFormModule,
		NzInputModule,
		NzSelectModule,
		NzButtonModule,
		NzIconModule,
		RouterLink,
	],
	templateUrl: './actualizar-sucursal.component.html',
	styleUrl: './actualizar-sucursal.component.scss',
})
export class ActualizarSucursalComponent implements OnInit {
	private readonly formBuilder = inject(FormBuilder);
	private readonly _sucursalService = inject(SucursalService);
	private readonly _tipoTelefonoService = inject(TipoTelefonoService);
	private readonly _paisService = inject(PaisService);
	private readonly _direccionService = inject(DireccionService);
	paises: IPaisCombo[] = [];
	tiposTelefono: ITelefonoCombo[] = [];
	direcciones: IComboBoxDireccion[] = [];
	private readonly modalRef = inject(NzModalRef);
	private readonly data = inject<ModalData>(NZ_MODAL_DATA);
	private readonly message = inject(NzMessageService);
	isLoading = true;

	sucursal!: Sucursale;

	formGroup = this.formBuilder.nonNullable.group({
		nombre_sucursal: ['', [Validators.required, Validators.minLength(5)]],
		telefono: ['', [Validators.required]],
		email: ['', [Validators.required, Validators.email]],
		id_direccion: ['', [Validators.required]],
		id_tipo_telefono: ['', [Validators.required]],
		id_pais: ['', [Validators.required]],
	});

	ngOnInit(): void {
		this.loadData();

		if (this.data.id_sucursal) {
			this._sucursalService.getSucursalById(this.data.id_sucursal).subscribe({
				next: (sucursal: Sucursale) => {
					this.sucursal = sucursal;
					this.formGroup.patchValue({
						nombre_sucursal: sucursal.nombre_sucursal,
						telefono: sucursal.telefono,
						email: sucursal.email,
						id_direccion: sucursal.id_direccion,
						id_tipo_telefono: sucursal.id_tipo_telefono,
						id_pais: sucursal.id_pais,
					});
				},
				error: (error) => {
					console.error('Error al cargar la sucursal', error);
				},
			});
		}
	}

	get nombreSucursalField(): FormControl<string> {
		return this.formGroup.controls.nombre_sucursal;
	}

	get telefonoSucursalField(): FormControl<string> {
		return this.formGroup.controls.telefono;
	}

	get emailSucursalField(): FormControl<string> {
		return this.formGroup.controls.email;
	}
	get direccionSucursalField(): FormControl<string> {
		return this.formGroup.controls.id_direccion;
	}

	get tipoTelefonoSucursalField(): FormControl<string> {
		return this.formGroup.controls.id_tipo_telefono;
	}

	get paisSucursalField(): FormControl<string> {
		return this.formGroup.controls.id_pais;
	}

	loadData() {
		this.isLoading = true;
		forkJoin({
			paises: this._paisService.getPaisesData(),
			tiposTelefono: this._tipoTelefonoService.getTiposTelefonosData(),
			direcciones: this._direccionService.getComboBoxDireccionesAll(),
		}).subscribe({
			next: (results) => {
				this.paises = results.paises;
				this.tiposTelefono = results.tiposTelefono;
				this.direcciones = results.direcciones;
				this.isLoading = false;
			},
			error: (error) => {
				console.error('Error cargando datos', error);
				this.message.error('Hubo un error al cargar los datos. Por favor, intente nuevamente.');
				this.isLoading = false;
			},
		});
	}

	onUpdateSucursal(): void {
		if (this.formGroup.valid && this.sucursal) {
			if (!this.formGroup.dirty) {
				this.message.warning('No se han realizado cambios en la sucursal');
				return;
			}

			const updatedSucursal: Sucursale = {
				...this.sucursal,
				...this.formGroup.value,
			};
			this._sucursalService.updateSucursal(updatedSucursal).subscribe({
				next: () => {
					this.message.success('Sucursal  actualizada correctamente');
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
			this.message.error(errorMessage);
		} else {
			this.message.error('Error al actualizar la categoría. Por favor, inténtelo de nuevo.');
		}
	}

	cancelar(): void {
		this.modalRef.close();
	}
}
