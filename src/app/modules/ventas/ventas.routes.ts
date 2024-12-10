import { Routes } from '@angular/router';

export const VENTAS_ROUTES: Routes = [
	{
		path: 'lista-venta',
		loadComponent: () => import('./pages/ventas-lista/ventas-lista.component'),
		data: {
			breadcrumb: 'Listado Ventas',
		},
	},
	{
		path: 'nueva-venta',
		loadComponent: () => import('./pages/crear-venta/crear-venta.component'),
		data: {
			breadcrumb: 'Crear Venta Nueva',
		},
	},

	{
		path: ':id',
		loadComponent: () => import('./pages/venta-detalles/venta-detalles.component'),
		data: {
			breadcrumb: 'Información Venta',
		},
	},

	{
		path: '**',
		redirectTo: 'lista-venta',
	},
];
