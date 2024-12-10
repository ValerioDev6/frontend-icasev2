import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const ADMIN_ROUTES: Routes = [
	{
		path: '',
		component: MainLayoutComponent,

		children: [
			{
				path: '',
				redirectTo: 'dashboard',
				pathMatch: 'full',
			},
			{
				path: 'dashboard',
				loadChildren: () => import('../dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
				title: 'App - Dashboard',
			},
			{
				path: 'personal',
				loadChildren: () => import('../personal/personal.routes').then((m) => m.PERSONAL_ROUTES),
				title: 'App - Personal',
				data: { breadcrumb: 'Mantenimiento Personal' },
			},

			{
				path: 'roles',
				loadChildren: () => import('../roles/roles.routes').then((m) => m.ROLES_ROUTES),
				title: 'App - Roles',
				data: { breadcrumb: 'Mantenimiento Roles' },
			},

			{
				path: 'marcas',
				loadChildren: () => import('../marcas/marcas.routes').then((m) => m.MARCAS_ROUTES),
				title: 'App - Marcas',
				data: { breadcrumb: 'Mantenimiento Marcas' },
			},

			{
				path: 'genero',
				loadChildren: () => import('../sexo/sexo.routes').then((m) => m.SEXO_ROUTES),
				title: 'App - Genero',
				data: { breadcrumb: ' Mantenimiento Genero' },
			},
			{
				path: 'categorias',
				loadChildren: () => import('../categorias/categorias.routes').then((m) => m.CATEGORIAS_ROUTES),
				title: 'App - Categorias',
				data: { breadcrumb: 'Mantenimiento Categorias' },
			},
			{
				path: 'productos',
				loadChildren: () => import('../productos/productos.routes').then((m) => m.PRODUCTOS_ROUTES),
				title: 'App - Productos',
				data: { breadcrumb: ' Mantenimiento Productos' },
			},

			{
				path: 'sucursal',
				loadChildren: () => import('../sucursal/sucursal.routes').then((m) => m.SUCURSALES_ROUTES),
				title: 'App - Sucursal',
				data: { breadcrumb: 'Mantenimiento Sucursales' },
			},
			{
				path: 'proveedor',
				loadChildren: () => import('../proveedor/proveedores.route').then((m) => m.PROVEEOR_ROUTES),
				title: 'App - Proveedores',
				data: { breadcrumb: 'Mantenimiento de Proveedores' },
			},
			{
				path: 'cliente',
				loadChildren: () => import('../clientes/clientes.routes').then((m) => m.CLIENTES_ROUTES),
				title: 'App - Clientes',
				data: { breadcrumb: 'Mantenimiento de Clientes' },
			},
			{
				path: 'compras',
				loadChildren: () => import('../compras/compras.routes').then((m) => m.COMPRAS_ROUTES),
				title: 'App - Compras',
				data: { breadcrumb: 'Mantenimiento de Compras' },
			},
			{
				path: 'ventas',
				loadChildren: () => import('../ventas/ventas.routes').then((m) => m.VENTAS_ROUTES),
				title: 'App - Ventas',
				data: { breadcrumb: 'Mantenimiento de Ventas' },
			},

			{
				path: 'kardex',
				loadChildren: () => import('../kardex/kardex.routes').then((m) => m.KARDEX_ROUTES),
				title: 'App - Kardex',
				data: { breadcrumb: 'KARDEX' },
			},
		],
	},
];
