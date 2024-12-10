export interface IClienteByIdDetallesResponse {
	id_personal: string;
	id_persona: string;
	id_rol: string;
	contrasenia: string;
	email: string;
	estado: boolean;
	personal_img: string;
	tb_personas: TbPersonas;
	tb_rol: TbRol;
	tb_ventas: TbVenta[];
}

export interface TbPersonas {
	id_persona: string;
	nombres: string;
	correo: any;
	id_tipo_persona: string;
	id_tipo_documento: string;
	id_sexo: string;
	fecha_nacimiento: string;
	id_direccion: string;
	id_pais: string;
	id_tipo_telefono: string;
	apellido_paterno: string;
	apellido_materno: string;
	numero_documento: string;
	telefono: any;
	razon_social: any;
	estado_documento: any;
	condicion_documento: any;
	distrito: any;
	provincia: any;
	departamento: any;
	tipo_persona: any;
	actividad_economica: any;
	tb_pais: TbPais;
	tb_tipo_telefono: TbTipoTelefono;
	tb_sexo: TbSexo;
	tb_direccion: TbDireccion;
	tb_tipo_persona: TbTipoPersona;
	tb_tipo_documento: TbTipoDocumento;
	tb_telefonos_persona: TbTelefonosPersona[];
}

export interface TbPais {
	id_pais: string;
	nombre: string;
}

export interface TbTipoTelefono {
	id_tipo_telefono: string;
	tipo_telefono: string;
	descripcion: string;
}

export interface TbSexo {
	id_sexo: string;
	sexo: string;
}

export interface TbDireccion {
	id_direccion: string;
	direccion: string;
	id_tipo_via: string;
	id_tipo_zona: string;
}

export interface TbTipoPersona {
	id_tipo_persona: string;
	tipo_persona: string;
	descripcion: string;
}

export interface TbTipoDocumento {
	id_tipo_documento: string;
	documento: string;
}

export interface TbTelefonosPersona {
	id_telefono: string;
	id_persona: string;
	id_tipo_telefono: string;
	numero_telefono: string;
}

export interface TbRol {
	id_rol: string;
	nombre_rol: string;
	descripcion: string;
	estado: boolean;
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
	tb_cliente: TbCliente;
	tb_metodo_pago: TbMetodoPago;
	tb_sucursales?: TbSucursales;
}

export interface TbCliente {
	id_cliente: string;
	id_persona: string;
	estado: boolean;
	fecha_registro: string;
	tipo_cliente: string;
	clasificacion: string;
	ultima_compra: string;
	total_compras: string;
	observaciones: string;
	codigo_cliente: string;
	tb_personas: TbPersonas2;
}

export interface TbPersonas2 {
	id_persona: string;
	nombres: string;
	correo: string;
	id_tipo_persona: string;
	id_tipo_documento: string;
	id_sexo: string;
	fecha_nacimiento: string;
	id_direccion: string;
	id_pais: string;
	id_tipo_telefono: string;
	apellido_paterno: string;
	apellido_materno: string;
	numero_documento: string;
	telefono: string;
	razon_social: string;
	estado_documento: string;
	condicion_documento: string;
	distrito: string;
	provincia: string;
	departamento: string;
	tipo_persona: string;
	actividad_economica: string;
}

export interface TbMetodoPago {
	id_metodo_pago: string;
	nombre_metodo_pago: string;
	descripcion: string;
	estado: number;
}

export interface TbSucursales {
	id_sucursal: string;
	nombre_sucursal: string;
	telefono: string;
	email: string;
	id_direccion: string;
	id_tipo_telefono: string;
	id_pais: string;
}
