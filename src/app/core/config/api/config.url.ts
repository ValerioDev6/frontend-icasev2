import { endpoint } from '../../constants/endpoints.api';

// export const url: string = 'https://nest-api-ezud.onrender.com/v1/api';
export const url: string = 'http://localhost:3000/v1/api';
export const BASE_URL = `${url}`;

export const URL_AUTH_SIGNIN = `${BASE_URL}/${endpoint.LOGIN_ENDPOINT}`;
export const URL_AUTH_CHECK_STATUS = `${BASE_URL}/${endpoint.CHECK_STATUS_ENDPOINT}`;
export const URL_AUTH_REFRESH = `${BASE_URL}/${endpoint.REFRESH_ENDPOINT}`;
export const URL_AUTH_CHANGE_PASSWORD = `${BASE_URL}/${endpoint.CHANGE_PASSWORD}`;

export const URL_PERSONAL_ALL = `${BASE_URL}/${endpoint.USUARIO_ENDPOINT}`;
export const URL_ROLES_ALL = `${BASE_URL}/${endpoint.ROLES_ENDPOINT}`;
export const URL_PERSONAS_ALL = `${BASE_URL}/${endpoint.PERSONA_ENDPOINT}`;

export const URL_SEXO_ALL = `${BASE_URL}/${endpoint.SEXO_ENDPOINT}`;

export const URL_MARCAS_ALL = `${BASE_URL}/${endpoint.MARCAS_ENDPOINT}`;
export const URL_CATEGORIAS = `${BASE_URL}/${endpoint.CATEGORIES_ENPOINT}`;
export const URL_PRODUCTOS_ALL = `${BASE_URL}/${endpoint.PRODUCTOS_ENDOINT}`;

export const URL_TIPO_ZONA_ALL = `${BASE_URL}/${endpoint.TIPO_ZONA}`;
export const URL_TIPO_VIA_ALL = `${BASE_URL}/${endpoint.TIPO_VIA}`;

export const URL_SUCURSAL_ALL = `${BASE_URL}/${endpoint.SUCURSAL_ENDPOINT}`;

export const URL_DIRECCION_ALL = `${BASE_URL}/${endpoint.DIRECCION_ENDPOINT}`;
export const URL_PAIS_ALL = `${BASE_URL}/${endpoint.PAIS_ENPOINT}`;
export const URL_TIPO_TELEFONO_ALL = `${BASE_URL}/${endpoint.TIPO_TELEFONO_ENDPOINT}`;
export const URL_TIPO_PERSONAS = `${BASE_URL}/${endpoint.TIPOS_PERSONAS}`;

export const URL_PROVEEDORES_ALL = `${BASE_URL}/${endpoint.PROVEEDORES_ENDPOINT}`;
export const URL_CLIENTE_ALL = `${BASE_URL}/${endpoint.CLIENTE_ENDPOINT}`;

export const URL_TIPO_PROPIETARIO = `${BASE_URL}/${endpoint.TIPOS_PROPIETARIOS}`;
export const URL_TIPO_DOCUMENTO = `${BASE_URL}/${endpoint.TIPO_DOCUMENTO}`;

export const URL_REPORTE_EXCEL = `${BASE_URL}/${endpoint.REPORTES_EXCEL}`;
export const URL_REPORTE_PDF = `${BASE_URL}/${endpoint.REPORTES_PDF}`;

export const URL_COMPRAS_ALL = `${BASE_URL}/${endpoint.COMPRAS}`;
export const URL_VENTAS_ALL = `${BASE_URL}/${endpoint.VENTAS}`;
export const URL_METODOS_PAGOS = `${BASE_URL}/${endpoint.METODO_PAGO}`;

export const URL_kARDEX_ALL = `${BASE_URL}/${endpoint.KARDEX_ENDOINT}`;

export const URL_TOTALES_ALL = `${BASE_URL}/${endpoint.SALES}`;
export const URL_UPLOAD = `${BASE_URL}/${endpoint.UPLOAD_EXCEL}`;
