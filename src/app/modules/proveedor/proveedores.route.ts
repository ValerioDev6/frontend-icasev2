import { Routes } from '@angular/router';

export const PROVEEOR_ROUTES: Routes = [
	{
		path: 'proveedor-lista',
		loadComponent: () => import('./pages/proveedores-lista/proveedores-lista.component'),
		data: {
			breadcrumb: 'Proveedores',
		},
	},
	{
		path: ':id',
		loadComponent: () => import('./pages/info-proveedor/info-proveedor.component'),
		data: {
			breadcrumb: 'Información Proveedor',
		},
	},

	{
		path: '**',
		redirectTo: 'proveedor-lista',
	},
];
