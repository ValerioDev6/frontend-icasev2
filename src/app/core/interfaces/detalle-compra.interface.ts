export interface IDetalleCompraResponse {
	id_compra: string;
	numero_documento: string;
	fecha_compra: Date;
	proveedor: Proveedor;
	metodo_pago: string;
	subtotal: string;
	igv: string;
	total: number;
	comentario: string;
	detalles: Detalle[];
}

export interface Detalle {
	id_detalle: string;
	producto: Producto;
	categoria: Categoria;
	cantidad: number;
	precio_unitario: string;
	subtotal: string;
}

export interface Categoria {
	id: string;
	nombre: string;
}

export interface Producto {
	id: string;
	nombre: string;
	codigo: string;
}

export interface Proveedor {
	id: string;
	nombre: string;
	ruc: string;
	correo: string;
}
