import { Routes } from '@angular/router';

export const KARDEX_ROUTES: Routes = [
	{
		path: 'kardex-lista',
		loadComponent: () => import('./pages/kardex-lista/kardex-lista.component'),
		data: {
			breadcrumb: 'Movimientos Entrada y Salida',
		},
	},
	{
		path: '**',
		redirectTo: 'kardex-lista',
	},
];
