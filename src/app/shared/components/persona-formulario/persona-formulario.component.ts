/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { PersonasService } from '../../../core/services/personas.service';
import { CommonModule } from '@angular/common';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { SexoService } from '../../../core/services/sexo.service';
import { DireccionService } from '../../../core/services/direccion.service';
import { TipoPersonaService } from '../../../core/services/tipo-persona.service';
import { TipoDocumentoService } from '../../../core/services/tipo-documento.service';
import { TipoTelefonoService } from '../../../core/services/tipo-telefono.service';
import { PaisService } from '../../../core/services/pais.service';
import { IGenerosCombo } from '../../../core/interfaces/sexo.interface';
import { IComboBoxDireccion } from '../../../core/interfaces/direcciones.interface';
import { ITipoPersonaCombo } from '../../../core/interfaces/tipo-persona.interface';
import { ITipoDocumentoCombo } from '../../../core/interfaces/tipo-documento.interface';
import { ITelefonoCombo } from '../../../core/interfaces/tipo-telefono.inteface';
import { IPaisCombo } from '../../../core/interfaces/pais.interface';
import { forkJoin } from 'rxjs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ReniecService } from '../../../core/services/reniec.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';

const NZ_MODULES = [
	NzMessageModule,
	NzIconModule,
	NzSelectModule,
	NzInputModule,
	NzDatePickerModule,
	NzFormModule,
	NzTabsModule,
];

@Component({
	selector: 'app-persona-formulario',
	standalone: true,
	imports: [FormsModule, ReactiveFormsModule, CommonModule, NZ_MODULES],
	templateUrl: './persona-formulario.component.html',
	styleUrl: './persona-formulario.component.scss',
})
export class PersonaFormularioComponent implements OnInit {
	private readonly _generoService = inject(SexoService);
	private readonly _direccionService = inject(DireccionService);
	private readonly _tipoPersonaService = inject(TipoPersonaService);
	private readonly _tipoDocumentoService = inject(TipoDocumentoService);
	private readonly _tipoTelefonoService = inject(TipoTelefonoService);
	private readonly _paisService = inject(PaisService);
	private readonly _reniecService = inject(ReniecService);
	selectedDocumentType: string | null = null;

	dniToSearch!: number;
	rucToSearch!: number;
	data!: any;
	ruc!: any;

	generos: IGenerosCombo[] = [];
	direcciones: IComboBoxDireccion[] = [];
	tiposPersonas: ITipoPersonaCombo[] = [];
	tipoDocumentos: ITipoDocumentoCombo[] = [];
	tipoTelefonos: ITelefonoCombo[] = [];
	paises: IPaisCombo[] = [];
	isLoading = true;
	isVisible = false;

	personaForm!: FormGroup;

	constructor(
		private fb: FormBuilder,
		private modalRef: NzModalRef,
		private personasService: PersonasService,
		private message: NzMessageService
	) {
		this.personaForm = this.fb.group({
			nombres: [''],
			apellido_paterno: [''],
			apellido_materno: [''],
			correo: ['', [Validators.email]],
			id_tipo_persona: [''],
			id_tipo_documento: [''],
			id_sexo: [''],
			fecha_nacimiento: ['', Validators.required],
			id_direccion: [''],
			id_pais: [''],
			id_tipo_telefono: ['', Validators.required],
			numero_documento: ['', Validators.required],
			telefono: [''],

			razon_social: [''],
			estado_documento: [''],
			condicion_documento: [''],
			distrito: [''],
			provincia: [''],
			departamento: [''],
			tipo_persona: [''],
			actividad_economica: [''],
		});
	}

	ngOnInit() {
		this.loadData();
	}

	private loadData() {
		this.isLoading = true;

		forkJoin({
			generos: this._generoService.getGenerosCombo(),
			direcciones: this._direccionService.getComboBoxDireccionesAll(),
			tiposPersonas: this._tipoPersonaService.getTipoPersonaCombo(),
			tipoDocumentos: this._tipoDocumentoService.getTipoDocumentoData(),
			tipoTelefonos: this._tipoTelefonoService.getTiposTelefonosData(),
			paises: this._paisService.getPaisesData(),
		}).subscribe({
			next: (results) => {
				this.generos = results.generos;
				this.direcciones = results.direcciones;
				this.tiposPersonas = results.tiposPersonas;
				this.tipoDocumentos = results.tipoDocumentos;
				this.tipoTelefonos = results.tipoTelefonos;
				this.paises = results.paises;
				this.isLoading = false;
			},

			error: (error) => {
				this.message.error(`Error fech data: ${error}`);
			},
		});
	}

	onSubmit() {
		if (this.personaForm.valid) {
			const personaData = this.personaForm.value;

			this.personasService.createPersonas(personaData).subscribe({
				next: () => {
					this.message.success('Persona Creada Exitosamente');
					this.modalRef.close(true);
					this.resetForm();
				},

				error: (err) => {
					console.log(err);
					this.message.error('Errro creating person', err);
				},
			});
		} else {
			this.validateForm();
		}
	}

	private validateForm(): void {
		Object.values(this.personaForm.controls).forEach((control) => {
			if (control.invalid) {
				control.markAsDirty();
				control.updateValueAndValidity({ onlySelf: true });
			}
		});
	}

	searchDocumentoInfo() {
		// Obtén el tipo de documento seleccionado

		const tipoDocumentoId = this.personaForm.get('id_tipo_documento')?.value;
		const tipoDocumento = this.tipoDocumentos.find((tipo) => tipo.id_tipo_documento === tipoDocumentoId);
		// Lógica de búsqueda según el tipo de documento

		if (tipoDocumento?.documento === 'DNI') {
			this.searchDniInfo();
		} else if (tipoDocumento?.documento === 'RUC') {
			this.searchToRucInfo();
		}
	}

	searchDniInfo() {
		// Puedes eliminar el toString si ya es number.

		this._reniecService.getDniInfo(this.dniToSearch).subscribe({
			next: (result) => {
				this.personaForm.patchValue({
					nombres: result.nombres,
					apellido_paterno: result.apellidoPaterno,
					apellido_materno: result.apellidoMaterno,
					numero_documento: result.numeroDocumento,
				});

				this.data = result;

				console.log(result);
			},

			error: (err) => {
				this.message.error('Error fetching DNI information');
				console.error(err);
			},
		});
	}

	resetForm() {
		this.personaForm.reset();
	}

	cancelar(): void {
		this.modalRef.close();
	}

	searchToRucInfo() {
		this._reniecService.getRucInfo(this.rucToSearch).subscribe({
			next: (result) => {
				this.personaForm.patchValue({
					razon_social: result.razonSocial,
					numero_documento: result.numeroDocumento,
					estado_documento: result.estado,
					condicion_documento: result.condicion,
					distrito: result.distrito,
					provincia: result.provincia,
					departamento: result.departamento,
					tipo_persona: result.tipo,
					actividad_economica: result.actividadEconomica,
				});

				this.ruc = result;
			},

			error: (err) => {
				this.message.error('Error fetching RUC information');
				console.error(err);
			},
		});
	}
	onDocumentTypeChange(documentTypeId: string) {
		// Encuentra el documento seleccionado por su ID
		const selectedDoc = this.tipoDocumentos.find((tipo) => tipo.id_tipo_documento === documentTypeId);

		// Establece el tipo de documento seleccionado
		this.selectedDocumentType = selectedDoc ? selectedDoc.documento : null;

		// Resetea los campos del formulario dependiendo del tipo de documento
		this.resetFormFields();
	}


	resetFormFields() {
		const form = this.personaForm;

		if (this.selectedDocumentType === 'DNI') {
			const rucFields = [
				'razon_social',
				'estado_documento',
				'condicion_documento',
				'distrito',
				'provincia',
				'departamento',
				'tipo_persona',
				'actividad_economica',
			];

			rucFields.forEach((field) => {
				form.get(field)?.reset('');
				form.get(field)?.disable();
			});

			const dniFields = ['nombres', 'apellido_paterno', 'apellido_materno'];

			dniFields.forEach((field) => {
				form.get(field)?.enable();
			});
		} else if (this.selectedDocumentType === 'RUC') {
			const dniFields = ['nombres', 'apellido_paterno', 'apellido_materno'];

			dniFields.forEach((field) => {
				form.get(field)?.reset('');
				form.get(field)?.disable();
			});

			const rucFields = [
				'razon_social',
				'estado_documento',
				'condicion_documento',
				'distrito',
				'provincia',
				'departamento',
				'tipo_persona',
				'actividad_economica',
			];

			rucFields.forEach((field) => {
				form.get(field)?.enable();
			});
		}
	}

	shouldShowInfoAdicionalTab(): boolean {
		return this.selectedDocumentType === 'RUC' || this.selectedDocumentType === 'DNI';
	}
}
