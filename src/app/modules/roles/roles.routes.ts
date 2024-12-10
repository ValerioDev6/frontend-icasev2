import { Routes } from '@angular/router';

export const ROLES_ROUTES: Routes = [
	{
		path: '',
		redirectTo: 'lista-roles',
		pathMatch: 'full',
	},
	{
		path: 'lista-roles',
		loadComponent: () => import('./pages/roles-lista/roles-lista.component'),
		data: {
			breadcrumb: 'Roles',
		},
	},
];
