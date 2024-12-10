export interface ISucursalResponse {
	info: Info;
	sucursales: Sucursale[];
}

export interface Info {
	page: number;
	limit: number;
	total: number;
	next: string;
	prev: null;
}

export interface Sucursale {
	id_sucursal: string;
	nombre_sucursal: string;
	telefono: string;
	email: string;
	id_direccion: string;
	id_tipo_telefono: string;
	id_pais: string;
	tb_direccion: TBDireccion;
	tb_tipo_telefono: TBTipoTelefono;
	tb_pais: TBPais;
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

export interface TBTipoTelefono {
	id_tipo_telefono: string;
	tipo_telefono: string;
	descripcion: string;
}

export interface ISucursaleSubmit {
	nombre_sucursal: string;
	telefono: string;
	email: string;
	id_direccion: string;
	id_tipo_telefono: string;
	id_pais: string;
}

export interface ISucursalComboBox {
	id_sucursal: string;
	nombre_sucursal: string;
	telefono: string;
	email: string;
	id_direccion: string;
	id_tipo_telefono: string;
	id_pais: string;
}
