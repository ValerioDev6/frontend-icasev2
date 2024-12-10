export interface IComprasDetallesResponse {
	info: Info;
	detalles: DetalleCompra[];
	resumen: Resumen;
}

export interface DetalleCompra {
	id_detalle_compra: string;
	id_compra: string;
	id_producto: string;
	id_categoria: string;
	cantidad: number;
	precio_unitario: string;
	subtotal: string;
	fecha_compra: Date;
	created_at: Date;
	tb_productos: TBProductos;
	tb_categorias: TBCategorias;
}

export interface TBCategorias {
	id_categoria: string;
	nombre_cat: string;
	estado: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface TBProductos {
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
}

export interface Info {
	page: number;
	limit: number;
	total: number;
	next: string;
	prev: null;
}

export interface Resumen {
	cantidad_items: number;
	monto_subtotal: number;
	monto_igv: number;
	monto_total: number;
}
