import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

import { PersonalService } from '../../../../core/services/personal.service';
import { RolesService } from '../../../../core/services/roles.service';
import { PersonasService } from '../../../../core/services/personas.service';
import { IRolCombo } from '../../../../core/interfaces/roles.interface';
import { ITipoPersonaPersonalCombo } from '../../../../core/interfaces/personas.interface';
import { forkJoin } from 'rxjs';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { PersonaFormularioComponent } from '../../../../shared/components/persona-formulario/persona-formulario.component';
const NZ_MODULES = [NzBreadCrumbModule, NzMessageModule, NzMessageModule];
@Component({
	selector: 'app-create-personal',
	standalone: true,
	imports: [NZ_MODULES, ReactiveFormsModule, FormsModule, CommonModule],
	templateUrl: './create-personal.component.html',
	styleUrl: './create-personal.component.scss',
})
export default class CreatePersonalComponent implements OnInit {
	private readonly _rolesService = inject(RolesService);
	private readonly _personasService = inject(PersonasService);
	private readonly _personalService = inject(PersonalService);

	roles: IRolCombo[] = [];
	tipoPersonasPersonal: ITipoPersonaPersonalCombo[] = [];
	isLoading = true;

	personalForm!: FormGroup;

	ngOnInit(): void {
		this.loadData();
	}

	constructor(
		private modalRef: NzModalRef,
		private fb: FormBuilder,
		private readonly _modal: NzModalService,
		private message: NzMessageService
	) {
		this.personalForm = this.fb.group({
			id_persona: ['', Validators.required],
			id_rol: ['', Validators.required],
			contrasenia: ['', Validators.required],
			email: ['', Validators.required],
			estado: [true, Validators.required],
			personal_img: ['', Validators.required],
		});
	}

	private loadData() {
		this.isLoading = false;
		forkJoin({
			roles: this._rolesService.getRolesCombo(),
			tipoPersonaPersonal: this._personasService.getPersonasByPersonal(),
		}).subscribe({
			next: (result) => {
				this.roles = result.roles;
				this.tipoPersonasPersonal = result.tipoPersonaPersonal;
				this.isLoading = false;
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
				top: '10px',
			},
		});
		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadData();
			}
		});
	}

	onSubmit() {
		if (this.personalForm.valid) {
			const personalData = this.personalForm.value;
			this._personalService.createPersonal(personalData).subscribe({
				next: () => {
					this.message.success('Personal creado exitosamente');
					this.resetForm();
					this.modalRef.close(true);
				},
				error: () => {
					this.message.error('ERORR');
				},
			});
		} else {
			this.validateForm();
		}
	}

	private validateForm(): void {
		Object.values(this.personalForm.controls).forEach((control) => {
			if (control.invalid) {
				control.markAsDirty();
				control.updateValueAndValidity({ onlySelf: true });
			}
		});
	}
	resetForm() {
		this.personalForm.reset();
	}

	cancelar(): void {
		this.modalRef.close();
	}
}
