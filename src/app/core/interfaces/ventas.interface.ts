export interface IVentasResponse {
	info: Info;
	ventas: Venta[];
}

export interface Info {
	page: number;
	limit: number;
	total: number;
	next: string;
	prev: null;
}

export interface Venta {
	id_venta: string;
	fecha_venta: Date;
	numero_documento: string;
	tipo_documento: string;
	subtotal: string;
	impuesto: string;
	precio_total: string;
	id_cliente: string;
	id_metodo_pago: string;
	id_sucursal: string;
	id_personal: string;
	estado_venta: string;
	serie_documento: string;
	observaciones: string;
	created_at: Date;
	updated_at: Date;
	tb_cliente: TBCliente;
	tb_metodo_pago: TBMetodoPago;
	tb_sucursales: TBSucursales;
	tb_personal: TBPersonal;
}

export interface TBCliente {
	id_cliente: string;
	id_persona: string;
	estado: boolean;
	fecha_registro: Date;
	tipo_cliente: string;
	clasificacion: string;
	ultima_compra: null;
	total_compras: string;
	observaciones: null;
	codigo_cliente: string;
	tb_personas: TBPersonas;
}

export interface TBPersonas {
	nombres: string;
}

export interface TBMetodoPago {
	nombre_metodo_pago: string;
}

export interface TBPersonal {
	id_personal: string;
	id_persona: string;
	id_rol: string;
	contrasenia: string;
	email: string;
	estado: boolean;
	personal_img: string;
	tb_personas: TBPersonas;
}

export interface TBSucursales {
	nombre_sucursal: string;
}
