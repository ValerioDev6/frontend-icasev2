export interface IDetalleVentaResponseByID {
	id_venta: string;
	fecha_venta: null;
	numero_documento: string;
	serie_documento: string;
	tipo_documento: string;
	cliente: Cliente;
	metodo_pago: string;
	sucursal: string;
	personal: Personal;
	subtotal: string;
	impuesto: string;
	precio_total: string;
	estado_venta: string;
	observaciones: string;
	detalles: Detalle[];
}

export interface Cliente {
	id: string;
	nombre: string;
}

export interface Detalle {
	id_detalle_venta: string;
	producto: Producto;
	cantidad: number;
	precio_unitario: string;
	subtotal: string;
	descuento: string;
}

export interface Producto {
	id: string;
	nombre: string;
	codigo: string;
}

export interface Personal {
	id: string;
	nombre: string;
	email: string;
	rol: string;
}
