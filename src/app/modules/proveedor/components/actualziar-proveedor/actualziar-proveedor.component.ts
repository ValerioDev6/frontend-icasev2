import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ProveedoresService } from '../../../../core/services/proveedores.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { Proveedore } from '../../../../core/interfaces/proveedores.interface';
import { PersonasService } from '../../../../core/services/personas.service';
import { forkJoin } from 'rxjs';
import { ITipoPersonaProveedorCombo } from '../../../../core/interfaces/personas.interface';
interface ModalData {
	id_proveedor: string;
}
@Component({
	selector: 'app-actualziar-proveedor',
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
		NzMessageModule,
	],
	templateUrl: './actualziar-proveedor.component.html',
	styleUrl: './actualziar-proveedor.component.scss',
})
export class ActualziarProveedorComponent implements OnInit {
	private readonly formBuilder = inject(FormBuilder);
	private readonly _proveedorService = inject(ProveedoresService);
	private readonly _personasService = inject(PersonasService);
	tipoPersonasProveedor: ITipoPersonaProveedorCombo[] = [];

	private readonly modalRef = inject(NzModalRef);
	private readonly data = inject<ModalData>(NZ_MODAL_DATA);
	private readonly message = inject(NzMessageService);

	isLoading = true;
	proveedor!: Proveedore;

	formGroup = this.formBuilder.nonNullable.group({
		id_persona: ['', [Validators.required]],
		estado_proveedor: ['', [Validators.required]],
		nombre_comercial: ['', [Validators.required]],
	});

	get personaProveedorControlField(): FormControl<string> {
		return this.formGroup.controls.id_persona;
	}

	get estadoProveedorControlField(): FormControl<string> {
		return this.formGroup.controls.estado_proveedor;
	}

	get nombreComercialControlField(): FormControl<string> {
		return this.formGroup.controls.nombre_comercial;
	}

	ngOnInit() {
		this.isLoading = true;
		this.loadData();
		if (this.data.id_proveedor) {
			this._proveedorService.getProveedorById(this.data.id_proveedor).subscribe({
				next: (proveedor: Proveedore) => {
					this.proveedor = proveedor;
					this.formGroup.patchValue({
						id_persona: proveedor.id_persona,
						estado_proveedor: proveedor.estado_proveedor,
						nombre_comercial: proveedor.nombre_comercial,
					});
				},
				error: (error) => {
					console.log('Errorr al cargar el proveedor', error);
				},
			});
		}
	}

	private loadData() {
		this.isLoading = true;
		forkJoin({
			tipoPersonasProveedor: this._personasService.getPersonasByProveedor(),
		}).subscribe({
			next: (result) => {
				this.tipoPersonasProveedor = result.tipoPersonasProveedor;
				this.isLoading = false;
			},
			error: (error) => {
				this.message.error(error);
				this.isLoading = false;
			},
		});
	}

	onUpdateProveedor(): void {
		if (this.formGroup.valid && this.proveedor) {
			if (!this.formGroup.dirty) {
				this.message.warning('No se han realizado cambios en el proveedor');
				return;
			}

			const updatedProveedor: Proveedore = {
				...this.proveedor,
				...this.formGroup.value,
			};
			this._proveedorService.updatePersonal(updatedProveedor).subscribe({
				next: () => {
					this.message.success('Proveedor  actualizada correctamente');
					this.modalRef.close(true);
				},
				error: (error) => {
					console.error('Error al actualizar el proveedor', error);
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
	obtenerNombreMostrar(persona: ITipoPersonaProveedorCombo): string {
		if (persona.razon_social && persona.razon_social !== 'null') {
			return persona.razon_social;
		}

		if (persona.nombre_completo && persona.nombre_completo !== 'null') {
			return persona.nombre_completo;
		}

		return 'Sin nombre';
	}
	cancelar(): void {
		this.modalRef.close();
	}
}
