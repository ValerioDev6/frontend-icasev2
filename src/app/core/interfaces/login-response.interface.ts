// export interface IResponseSingIn {
// 	user: User;
// 	access_token: string;
// }

// export interface User {
// 	id_personal: string;
// 	email: string;
// 	estado: boolean;
// 	personal_img: string;
// 	tb_personas: TBPersonas;
// 	tb_rol: TBRol;
// }

// export interface TBPersonas {
// 	id_persona: string;
// 	nombres: string;
// }

// export interface TBRol {
// 	id_rol: number;
// 	nombre_rol: string;
// }
export interface IResponseSingIn {
	personal: Personal;
	access_token: string;
}

export interface Personal {
	id_personal: string;
	id_persona: string;
	id_rol: string;
	email: string;
	estado: boolean;
	personal_img: string;
}
