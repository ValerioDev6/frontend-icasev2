export interface IClienteResponse {
	info: Info;
	cliente: Cliente[];
}

export interface Cliente {
	id_cliente: string;
	id_persona: string;
	estado: number;
	fecha_registro: Date;
	tipo_cliente: string;
	clasificacion: string;
	ultima_compra: null;
	total_compras: string;
	observaciones: string;
	codigo_cliente: string;
	tb_personas: TBPersonas;
}

export interface TBPersonas {
	id_persona: string;
	nombres: string;
	correo: string;
	id_tipo_persona: string;
	id_tipo_documento: string;
	id_sexo: string;
	fecha_nacimiento: Date;
	id_direccion: string;
	id_pais: string;
	id_tipo_telefono: string;
	apellido_paterno: string;
	apellido_materno: string;
	numero_documento: string;
	telefono: null;
}

export interface Info {
	page: number;
	limit: number;
	total: number;
	next: string;
	prev: null;
}

export interface IClienteComboResponse {
	id_cliente: string;
	tb_personas: TBPersona;
}

export interface TBPersona {
	numero_documento: string;
	correo: string;
	telefono: string;
	nombres: string;
	razon_social: string;
	tb_direccion: TBDireccion;
}

export interface TBDireccion {
	direccion: string;
}
