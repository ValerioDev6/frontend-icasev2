export interface ICategorieResponseData {
	info: Info;
	categories: Category[];
}

export interface Category {
	id_categoria: string;
	nombre_cat: string;
	estado: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface Info {
	page: number;
	limit: number;
	total: number;
	next: string;
	prev: null;
}

export interface IComboBoxCategorie {
	id_categoria: string;
	nombre_cat: string;
	estado: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface ICategorySubmit {
	nombre_cat: string;
	estado: boolean;
	created_at: Date;
}
