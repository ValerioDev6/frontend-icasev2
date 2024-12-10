import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IPersonalResponseData } from '../../../../core/interfaces/persona-resposponse';

@Component({
	selector: 'app-configuracion-personal',
	standalone: true,
	imports: [RouterModule],
	templateUrl: './configuracion-personal.component.html',
	styleUrl: './configuracion-personal.component.scss',
})
export default class ConfiguracionPersonalComponent implements OnInit {
	personal: IPersonalResponseData | null = null;
	personalId: string | null = null;

	constructor(private route: ActivatedRoute) {}

	ngOnInit() {
		this.route.paramMap.subscribe((params) => {
			this.personalId = params.get('id');
			// Aquí deberías cargar los datos del personal usando este ID
			// Por ejemplo: this.loadPersonalData(this.personalId);
		});
	}
}
