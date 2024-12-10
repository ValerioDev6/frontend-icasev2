export interface IClienteByIDResponse {
	id_cliente: string;
	id_persona: string;
	estado: boolean;
	fecha_registro: string;
	tipo_cliente: string;
	clasificacion: string;
	ultima_compra: string;
	total_compras: number;
	observaciones: string;
	codigo_cliente: string;
	tb_personas: TbPersonas;
	tb_ventas: TbVenta[];
}

export interface TbPersonas {
	nombres: string;
	correo: string;
	razon_social: string;
	fecha_nacimiento: string;
	numero_documento: string;
	telefono: string;
	tb_direccion: TbDireccion;
	tb_pais: TbPais;
	tb_sexo: TbSexo;
	tb_telefonos_persona: TbTelefonosPersona[];
}

export interface TbDireccion {
	id_direccion: string;
	direccion: string;
	id_tipo_via: string;
	id_tipo_zona: string;
}

export interface TbPais {
	id_pais: string;
	nombre: string;
}

export interface TbSexo {
	id_sexo: string;
	sexo: string;
}

export interface TbTelefonosPersona {
	id_telefono: string;
	id_persona: string;
	id_tipo_telefono: string;
	numero_telefono: string;
}

export interface TbVenta {
	id_venta: string;
	fecha_venta: string;
	numero_documento: string;
	tipo_documento: string;
	subtotal: number;
	impuesto: number;
	precio_total: number;
	id_cliente: string;
	id_metodo_pago: string;
	id_sucursal?: string;
	id_personal: string;
	estado_venta: string;
	serie_documento: string;
	observaciones: string;
	created_at: string;
	updated_at: string;
}
