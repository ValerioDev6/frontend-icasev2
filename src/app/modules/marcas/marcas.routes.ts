import { Routes } from '@angular/router';

export const MARCAS_ROUTES: Routes = [
	{
		path: 'marcas-lista',
		loadComponent: () => import('./pages/marcas-lista/marcas-lista.component'),
		data: {
			breadcrumb: 'Marcas',
		},
	},
	{
		path: '**',
		redirectTo: 'marcas-lista',
	},
];
