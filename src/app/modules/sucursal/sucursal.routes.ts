import { Routes } from '@angular/router';

export const SUCURSALES_ROUTES: Routes = [
	{
		path: 'sucursales-lista',
		loadComponent: () => import('./pages/sucursal-page-lista/sucursal-page-lista.component'),
		data: {
			breadcrumb: 'Sucursal',
		},
	},
	{
		path: '**',
		redirectTo: 'sucursales-lista',
	},
];
