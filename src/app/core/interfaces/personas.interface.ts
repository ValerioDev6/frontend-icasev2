// export interface IPersona {
// 	nombres: string;
// 	apellido_paterno: string;
// 	apellido_materno: string;
// 	correo?: string;
// 	id_tipo_persona?: string;
// 	id_tipo_documento?: string;
// 	id_sexo?: string;
// 	fecha_nacimiento?: Date;
// 	id_direccion?: string;
// 	id_pais?: string;
// 	id_tipo_telefono?: string;
// 	numero_documento: string;
// 	telefono?: string;
// }

// export interface IPersonal {
// 	id_rol?: string;
// 	contrasenia: string;
// 	email?: string;
// 	estado: boolean;
// 	personal_img?: string;
// }

// export interface IProveedor {
// 	nombre_comercial?: string;
// 	estado_proveedor?: 'Activo' | 'Inactivo';
// }

// export interface ICliente {
// 	nombre_cliente: string;
// }

export enum TipoPersona {
	PERSONAL = 'PERSONAL',
	CLIENTE = 'CLIENTE',
	PROVEEDOR = 'PROVEEDOR',
}

// models/interfaces/response.interface.ts
export interface IApiResponse<T> {
	success: boolean;
	data: T;
	message: string;
}

// models/interfaces/persona.interface.ts
export interface IPersona {
	id_persona?: string;
	nombres: string;
	apellido_paterno: string;
	apellido_materno: string;
	correo?: string;
	id_tipo_persona?: string;
	id_tipo_documento?: string;
	id_sexo?: string;
	fecha_nacimiento?: Date;
	id_direccion?: string;
	id_pais?: string;
	id_tipo_telefono?: string;
	numero_documento: string;
	telefono?: string;
}

export interface IPersonal {
	id_persona: string;
	id_rol: string;
	contrasenia: string;
	email: string;
	estado: boolean;
	personal_img: string;
}

export interface IPersonalSubmit {
	id_persona: string;
	id_rol: string;
	contrasenia: string;
	email: string;
	estado: boolean;
	personal_img: string;
}

export interface IProveedor extends IPersona {
	nombre_comercial?: string;
	estado_proveedor?: 'Activo' | 'Inactivo';
}

export interface ICliente extends IPersona {
	nombre_cliente: string;
}

export interface ITipoPersonaClienteCombo {
	id_persona: string;
	nombre_completo: string;
}

export interface ITipoPersonaPersonalCombo {
	id_persona: string;
	nombre_completo: string;
}

export interface ITipoPersonaProveedorCombo {
	id_persona: string;
	razon_social: string;
	nombre_completo: string;
}
