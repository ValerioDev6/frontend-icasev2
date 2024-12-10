export interface IKardexResponse {
	info: Info;
	kardex: Kardex[];
}

export interface Info {
	page: number;
	limit: number;
	total: number;
	next: string;
	prev: null;
}

export interface Kardex {
	id_kardex: string;
	id_producto: string;
	fecha_movimiento: Date;
	tipo_movimiento: string;
	tipo_documento: string;
	numero_documento: string;
	cantidad: number;
	precio_unitario: string;
	total: string;
	stock_anterior: number;
	stock_actual: number;
	tb_productos: TBProductos;
}

export interface TBProductos {
	nombre_producto: string;
}
