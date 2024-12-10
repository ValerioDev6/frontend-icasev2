export interface IProveedorByIDResponseIndividual {
	id_proveedor: string;
	id_persona: string;
	estado_proveedor: string;
	created_at: Date;
	updated_at: Date;
	nombre_comercial: string;
	total_compras: number;
	ultima_compra: Date;
	tb_personas: TBPersonas;
	tb_compra: TBCompra[];
}

export interface TBCompra {
	id_compra: string;
	id_metodo_pago: string;
	proveedor_id: string;
	proveedor_ruc: string;
	proveedor_correo: string;
	numero_documento: string;
	compra_subtotal: string;
	compra_igv: string;
	compra_total: string;
	compra_comentario: string;
	fecha_compra: Date;
}

export interface TBPersonas {
	nombres: string;
	correo: string;
	razon_social: string;
	fecha_nacimiento: Date;
	numero_documento: string;
	telefono: string;
	tb_direccion: TBDireccion;
	tb_pais: TBPais;
	tb_sexo: TBSexo;
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
