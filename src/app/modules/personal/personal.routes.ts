import { Routes } from '@angular/router';

export const PERSONAL_ROUTES: Routes = [
	{
		path: 'lista-personal',
		loadComponent: () => import('./pages/personal-list/personal-list.component'),
		data: {
			breadcrumb: 'Personal',
		},
	},
	{
		path: 'crear-personal',
		loadComponent: () => import('./pages/create-personal/create-personal.component'),
		data: {
			breadcrumb: 'Crear  Personal',
		},
	},
	{
		path: 'perfil/:id_personal',
		loadComponent: () => import('./pages/perfil-personal/perfil-personal.component'),
		data: {
			breadcrumb: 'Perfil de Personal',
		},
	},

	{
		path: ':id',
		loadComponent: () => import('./pages/info-personal/info-personal.component'),
		data: {
			breadcrumb: 'Información Personal',
		},
	},

	{
		path: 'configuracion/:id',
		loadComponent: () => import('./pages/configuracion-personal/configuracion-personal.component'),
		data: {
			breadcrumb: 'Configuracione Personal',
		},
		children: [
			{
				path: '',
				loadComponent: () => import('./pages/editar-personal/editar-personal.component'),
				data: {
					breadcrumb: 'Editar Personal',
				},
			},
			{
				path: 'cambiar-contrasena',
				loadComponent: () => import('./pages/cambiar-password/cambiar-password.component'),
				data: {
					breadcrumb: 'Cambiar Contraseña',
				},
			},
		],
	},
	{
		path: '**',
		redirectTo: 'lista-personal',
	},
];
