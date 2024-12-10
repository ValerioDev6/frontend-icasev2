export interface IMarcasResponseData {
	info: Info;
	marcas: Marca[];
}

export interface Info {
	page: number;
	limit: number;
	total: number;
	next: string;
	prev: null;
}

export interface Marca {
	id_marca: string;
	nombre_marca: string;
	estado: boolean;
	created_at: Date;
}

export interface IMarcaSubmit {
	nombre_marca: string;
	estado: boolean;
	created_at: Date;
}

export interface IMarcaComboBox {
	id_marca: string;
	nombre_marca: string;
	estado: boolean;
	created_at: Date;
	updated_at: Date;
}
