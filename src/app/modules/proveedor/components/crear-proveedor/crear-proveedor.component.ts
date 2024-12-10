/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { RouterModule } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ProveedoresService } from '../../../../core/services/proveedores.service';
import { PersonasService } from '../../../../core/services/personas.service';
import { forkJoin } from 'rxjs';
import { ITipoPersonaProveedorCombo } from '../../../../core/interfaces/personas.interface';
import { PersonaFormularioComponent } from '../../../../shared/components/persona-formulario/persona-formulario.component';

@Component({
	selector: 'app-crear-proveedor',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		NzInputModule,
		NzIconModule,
		NzButtonModule,
		ReactiveFormsModule,
		NzTableModule,
		NzPaginationModule,
		NzFormModule,
		NzLayoutModule,
		NzToolTipModule,
		NzSelectModule,
		FormsModule,
		NzDropDownModule,
		NzDividerModule,
		NzCardModule,
		NzTagModule,
		NzIconModule,
		NzBreadCrumbModule,
		NzModalModule,
		NzMessageModule,
		NzSpinModule,
	],
	templateUrl: './crear-proveedor.component.html',
	styleUrl: './crear-proveedor.component.scss',
})
export class CrearProveedorComponent implements OnInit {
	private readonly _proveedorService = inject(ProveedoresService);
	private readonly _personasService = inject(PersonasService);

	tipoPersonasProveedor: ITipoPersonaProveedorCombo[] = [];

	proveedorForm!: FormGroup;
	loading: boolean = true;

	ngOnInit(): void {
		this.loadData();
	}

	constructor(
		private modalRef: NzModalRef,
		private readonly fb: FormBuilder,
		private readonly message: NzMessageService,
		private readonly _modal: NzModalService
	) {
		this.proveedorForm = this.fb.group({
			id_persona: ['', Validators.required],
			estado_proveedor: ['', Validators.required],
			nombre_comercial: ['', Validators.required],
		});
	}

	private loadData() {
		this.loading = false;
		forkJoin({
			tipoPersonasProveedor: this._personasService.getPersonasByProveedor(),
		}).subscribe({
			next: (result) => {
				this.tipoPersonasProveedor = result.tipoPersonasProveedor;
			},
			error: (error) => {
				this.message.error(error);
			},
		});
	}

	openPersonaModal() {
		const modal = this._modal.create({
			nzFooter: null,
			nzContent: PersonaFormularioComponent,
			nzWidth: '1000px',
			nzStyle: {
				top: '30px',
			},
		});
		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadData();
			}
		});
	}

	onSubmit() {
		if (this.proveedorForm.valid) {
			const proveedorData = this.proveedorForm.value;
			this._proveedorService.createProveedores(proveedorData).subscribe({
				next: () => {
					this.message.success('Proveedor Creado exitosamente');
					this.modalRef.close(true);
					this.resetForm();
				},
				error: (err) => {
					console.log('Error save proveedo', err);
				},
			});
		}
	}

	cancelar(): void {
		this.modalRef.close();
	}

	resetForm() {
		this.proveedorForm.reset();
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
}
