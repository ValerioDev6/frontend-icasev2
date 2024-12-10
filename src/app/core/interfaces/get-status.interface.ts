export interface CheckStatusResponse {
	id_personal: string;
	email: string;
	estado: boolean;
	personal_img: string;
	id_rol: number;
	persona: User;
	token: string;
}

export interface User {
	nombres: string;
	apellido_paterno: string;
	apellido_materno: string;
}
