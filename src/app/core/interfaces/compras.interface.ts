export interface IComprasPaginationResponse {
	info: Info;
	compras: Compra[];
}

export interface Info {
	page: number;
	limit: number;
	total: number;
	next: string;
	prev: string;
}

export interface Compra {
	id_compra: string;
	id_metodo_pago: string;
	proveedor_id?: string;
	proveedor_ruc: string;
	proveedor_correo: string;
	numero_documento: string;
	compra_subtotal: string;
	compra_igv: string;
	compra_total: string;
	compra_comentario: string;
	fecha_compra: string;
	tb_proveedores?: TbProveedores;
	tb_metodo_pago: TbMetodoPago;
}

export interface TbProveedores {
	id_proveedor: string;
	id_persona: string;
	estado_proveedor: string;
	created_at: string;
	updated_at: string;
	nombre_comercial: string;
	total_compras: string;
	ultima_compra: string;
	tb_personas: TbPersonas;
}

export interface TbPersonas {
	id_persona: string;
	nombres?: string;
	correo: string;
	id_tipo_persona: string;
	id_tipo_documento: string;
	id_sexo: string;
	fecha_nacimiento: string;
	id_direccion: string;
	id_pais: string;
	id_tipo_telefono: string;
	apellido_paterno?: string;
	apellido_materno?: string;
	numero_documento: string;
	telefono: string;
	razon_social?: string;
	estado_documento?: string;
	condicion_documento?: string;
	distrito?: string;
	provincia?: string;
	departamento?: string;
	tipo_persona?: string;
	actividad_economica?: string;
}

export interface TbMetodoPago {
	id_metodo_pago: string;
	nombre_metodo_pago: string;
	descripcion: string;
	estado: number;
}
