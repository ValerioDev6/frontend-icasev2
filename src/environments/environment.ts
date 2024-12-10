export interface Environment {
	BACKEND_URL: string;
	RENIEC_URL: string;
}

export const environment: Environment = {
	BACKEND_URL: 'http://localhost:3000/v1/api',
	RENIEC_URL: 'https://api.apis.net.pe/v2/reniec/dni',

	// BACKEND_URL: 'https://nest-api-ezud.onrender.com/v1/api',
};
