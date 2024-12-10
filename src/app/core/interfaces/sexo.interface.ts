export interface ISexoResponse {
	info: Info;
	sexos: Sexo[];
}

export interface Info {
	page: number;
	limit: number;
	total: number;
	next: string;
	prev: null;
}

export interface Sexo {
	id_sexo: string;
	sexo: string;
}
export interface IGenerosCombo {
	id_sexo: string;
	sexo: string;
}
