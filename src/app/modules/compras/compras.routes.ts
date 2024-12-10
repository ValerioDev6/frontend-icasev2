import { Routes } from '@angular/router';

export const COMPRAS_ROUTES: Routes = [
	{
		path: 'lista-compra',
		loadComponent: () => import('./pages/compras-lista/compras-lista.component'),
		data: {
			breadcrumb: 'Compras',
		},
	},
	{
		path: 'crear-compra',
		loadComponent: () => import('./pages/crear-compra/crear-compra.component'),
		data: {
			breadcrumb: 'Crear Compra',
		},
	},
	{
		path: ':id',
		loadComponent: () => import('./pages/compra-detalles/compra-detalles.component'),
		data: {
			breadcrumb: 'Información compra',
		},
	},
	{
		path: '**',
		redirectTo: 'lista-compra',
	},
];
