import { Component, OnInit } from '@angular/core';
import { IPersonalResponseData } from '../../../../core/interfaces/persona-resposponse';
import { PersonalService } from '../../../../core/services/personal.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-perfil-personal',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './perfil-personal.component.html',
	styleUrl: './perfil-personal.component.scss',
})
export default class PerfilPersonalComponent implements OnInit {
	personalData!: IPersonalResponseData;
	loading = false;
	error: string | null = null;

	constructor(
		private personalService: PersonalService,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			const id = params['id_personal'];
			if (id) {
				this.loadPersonalData(id);
			} else {
				this.error = 'No se proporcionó un ID de personal válido.';
			}
		});
	}

	loadPersonalData(id: string): void {
		this.loading = true;
		this.error = null;

		this.personalService.getPersonalById(id).subscribe({
			next: (data) => {
				this.personalData = data;
				this.loading = false;
			},
			error: (err) => {
				this.error = 'Ocurrió un error al cargar los datos del perfil.';
				this.loading = false;
				console.error('Error loading personal data:', err);
			},
		});
	}
}
