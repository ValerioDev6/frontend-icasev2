import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { forkJoin } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IPaisCombo } from '../../../../core/interfaces/pais.interface';
import { ITelefonoCombo } from '../../../../core/interfaces/tipo-telefono.inteface';
import { IComboBoxDireccion } from '../../../../core/interfaces/direcciones.interface';
import { PaisService } from '../../../../core/services/pais.service';
import { TipoTelefonoService } from '../../../../core/services/tipo-telefono.service';
import { DireccionService } from '../../../../core/services/direccion.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ISucursaleSubmit } from '../../../../core/interfaces/sucursales.interface';
import { SucursalService } from '../../../../core/services/sucursales.service';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
	selector: 'app-crear-sucursal',
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
	],
	templateUrl: './crear-sucursal.component.html',
	styleUrls: ['./crear-sucursal.component.scss'],
})
export class CrearSucursalComponent implements OnInit {
	sucursalForm: FormGroup;
	paises: IPaisCombo[] = [];
	tiposTelefono: ITelefonoCombo[] = [];
	direcciones: IComboBoxDireccion[] = [];
	isLoading = true;

	constructor(
		private modalRef: NzModalRef,

		private fb: FormBuilder,
		private _sucursalService: SucursalService,
		private paisService: PaisService,
		private tipoTelefonoService: TipoTelefonoService,
		private direccionService: DireccionService,
		private message: NzMessageService
	) {
		this.sucursalForm = this.fb.group({
			nombre_sucursal: ['', [Validators.required, Validators.minLength(5)]],
			telefono: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			id_direccion: ['', [Validators.required]],
			id_tipo_telefono: ['', [Validators.required]],
			id_pais: ['', [Validators.required]],
		});
	}

	get nombreSucursalControl() {
		return this.sucursalForm.get('nombre_sucursal');
	}
	get telefonoControl() {
		return this.sucursalForm.get('telefono');
	}
	get emaiLControl() {
		return this.sucursalForm.get('email');
	}
	get direccionControl() {
		return this.sucursalForm.get('id_direccion');
	}
	get tipoTelefonoControl() {
		return this.sucursalForm.get('id_tipo_telefono');
	}
	get paisControl() {
		return this.sucursalForm.get('id_pais');
	}

	ngOnInit() {
		this.loadData();
		this.tipoTelefonoControl?.valueChanges.subscribe(() => {
			this.telefonoControl?.reset();
		});
	}

	loadData() {
		this.isLoading = true;
		forkJoin({
			paises: this.paisService.getPaisesData(),
			tiposTelefono: this.tipoTelefonoService.getTiposTelefonosData(),
			direcciones: this.direccionService.getComboBoxDireccionesAll(),
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

	onSubmit() {
		if (this.sucursalForm.valid) {
			const sucursalData: ISucursaleSubmit = this.sucursalForm.value;
			this._sucursalService.createSucursal(sucursalData).subscribe({
				next: () => {
					this.message.success('Sucursal creada exitosamente');
					this.modalRef.close(true);
				},
				error: (erro) => {
					this.message.error('ERRORR', erro);
				},
			});
		} else {
			this.validateForm();
		}
	}

	private validateForm(): void {
		Object.values(this.sucursalForm.controls).forEach((control) => {
			if (control.invalid) {
				control.markAsDirty();
				control.updateValueAndValidity({ onlySelf: true });
			}
		});
	}

	cancelar(): void {
		this.modalRef.close();
	}
}
