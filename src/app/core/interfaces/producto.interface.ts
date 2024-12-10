export interface IProductoResponse {
	info: Info;
	productos: Producto[];
}

export interface Info {
	page: number;
	limit: number;
	total: number;
	next: string;
	prev: null;
}

export interface Producto {
	id_producto: string;
	nombre_producto: string;
	descripcion: string;
	stock: number;
	id_categoria: string;
	fecha_creacion: Date;
	id_marca: string;
	is_active: boolean;
	precio_compra: string;
	precio_venta: string;
	producto_img: string;
	fecha_ingreso: Date;
	codigo_producto: string;
	updated_at: Date;
	estado_produto: string;
	id_sucursal: string;
	id_tipo_propietario: string;
	precio_base_sin_igv: number;
	tb_marcas: TBMarcas;
	tb_categorias: TBCategorias;
	tb_tipo_propietario: TBTipoPropietario;
	tb_sucursales: TBSucursales;
}

export interface IProductoSubmit {
	nombre_producto: string;
	descripcion: string;
	stock: number;
	id_categoria: string;
	fecha_creacion: Date;
	id_marca: string;
	is_active: boolean;
	precio_compra: string;
	precio_venta: string;
	producto_img: string;
	fecha_ingreso: Date;
	codigo_producto: string;
	updated_at: Date;
	estado_produto: string;
	id_sucursal: string;
	id_tipo_propietario: string;
	tb_marcas: TBMarcas;
	tb_categorias: TBCategorias;
	tb_tipo_propietario: TBTipoPropietario;
	tb_sucursales: TBSucursales;
}

export interface TBCategorias {
	nombre_cat: string;
}

export interface TBMarcas {
	nombre_marca: string;
}

export interface TBSucursales {
	nombre_sucursal: string;
}

export interface TBTipoPropietario {
	descripcion: string;
}

// export interface IProductosComboResponse {
// 	id_producto: string;
// 	nombre_producto: string;
// 	precio_venta: string;
// 	stock: number;
// }

export interface IProductosComboResponse {
	id_producto: string;
	nombre_producto: string;
	precio_venta: string;
	stock: number;
	tb_marcas: TBMarcas;
}

export interface TBMarcas {
	nombre_marca: string;
}

export interface IProductoByIDResponse {
	id_producto: string;
	nombre_producto: string;
	descripcion: string;
	stock: number;
	id_categoria: string;
	fecha_creacion: Date;
	id_marca: string;
	is_active: boolean;
	precio_compra: number;
	precio_venta: number;
	producto_img: string;
	fecha_ingreso: Date;
	codigo_producto: string;
	updated_at: Date;
	estado_produto: string;
	id_sucursal: string;
	id_tipo_propietario: string;
	precio_base_sin_igv: number;
	tb_tipo_propietario: TBTipoPropietarioResponse;
	tb_categorias: TBCategoriasResponse;
	tb_marcas: TBMarcasResponse;
	tb_sucursales: TBSucursalesResponse;
}

export interface TBCategoriasResponse {
	id_categoria: string;
	nombre_cat: string;
	estado: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface TBMarcasResponse {
	id_marca: string;
	nombre_marca: string;
	estado: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface TBSucursalesResponse {
	id_sucursal: string;
	nombre_sucursal: string;
	telefono: string;
	email: string;
	id_direccion: string;
	id_tipo_telefono: string;
	id_pais: string;
}

export interface TBTipoPropietarioResponse {
	id_tipo_propietario: string;
	descripcion: string;
}
