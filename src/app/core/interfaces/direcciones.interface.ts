export interface IDireccionResponse {
	info: Info;
	direcciones: Direccione[];
}

export interface Direccione {
	id_direccion: string;
	direccion: string;
	id_tipo_via: string;
	id_tipo_zona: string;
	tb_tipo_via: TBTipoVia;
	tb_tipo_zona: TBTipoZona;
}

export interface TBTipoVia {
	id_tipo_via: string;
	codigo: string;
	descripcion: string;
}

export interface TBTipoZona {
	id_tipo_zona: string;
	codigo: string;
	descripcion: string;
}

export interface Info {
	page: number;
	limit: number;
	total: number;
	next: string;
	prev: null;
}

export interface IComboBoxDireccion {
	id_direccion: string;
	direccion: string;
	id_tipo_via: string;
	id_tipo_zona: string;
}
