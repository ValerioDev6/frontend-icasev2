export interface IPersonalResponseData {
	id_personal: string;
	id_persona: string;
	id_rol: string;
	contrasenia: string;
	email: string;
	estado: boolean;
	personal_img: string;
	tb_personas: TBPersonas;
	tb_rol: TBRol;
}

export interface TBPersonas {
	id_persona: string;
	nombres: string;
	correo: null;
	id_tipo_persona: string;
	id_tipo_documento: string;
	id_sexo: string;
	fecha_nacimiento: Date;
	id_direccion: string;
	id_pais: string;
	id_tipo_telefono: string;
	apellido_paterno: string;
	apellido_materno: string;
	tb_pais: TBPais;
	tb_tipo_telefono: TBTipoTelefono;
	tb_sexo: TBSexo;
	tb_direccion: TBDireccion;
	tb_tipo_persona: TBTipoPersona;
	tb_tipo_documento: TBTipoDocumento;
	tb_telefonos_persona: TBTelefonosPersona[];
}

export interface TBDireccion {
	id_direccion: string;
	direccion: string;
	id_tipo_via: string;
	id_tipo_zona: string;
}

export interface TBPais {
	id_pais: string;
	nombre: string;
}

export interface TBSexo {
	id_sexo: string;
	sexo: string;
}

export interface TBTelefonosPersona {
	id_telefono: string;
	id_persona: string;
	id_tipo_telefono: string;
	numero_telefono: string;
}

export interface TBTipoDocumento {
	id_tipo_documento: string;
	documento: string;
}

export interface TBTipoPersona {
	id_tipo_persona: string;
	tipo_persona: string;
	descripcion: string;
}

export interface TBTipoTelefono {
	id_tipo_telefono: string;
	tipo_telefono: string;
	descripcion: string;
}

export interface TBRol {
	id_rol: string;
	nombre_rol: string;
	descripcion: string;
	estado: boolean;
}
