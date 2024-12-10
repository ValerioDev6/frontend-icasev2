import { Routes } from '@angular/router';

export const SEXO_ROUTES: Routes = [
	{
		path: 'lista-generos',
		loadComponent: () => import('./pages/sexo-lista/sexo-lista.component'),
		data: {
			breadcrumb: 'Generos',
		},
	},
];
