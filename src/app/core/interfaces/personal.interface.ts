
export interface IPersonalResponse {
  info:     Info;
  personal: Personal[];
}

export interface Info {
  page:  number;
  limit: number;
  total: number;
  next:  string;
  prev:  null;
}

export interface Personal {
  id_personal:  string;
  id_persona:   string;
  id_rol:       number;
  contrasenia:  string;
  estado:       boolean;
  personal_img: string;
  email:        string;
  tb_personas:  TBPersonas;
  tb_rol:       TBRol;
}

export interface TBPersonas {
  id_persona:        string;
  nombres:           string;
  apellido_p:        string;
  apellido_m:        string;
  fecha_nacimiento:  Date;
  id_sexo:           string;
  id_direccion:      string;
  id_tipo_persona:   string;
  id_tipo_documento: string;
  id_telefono:       string;
  id_pais:           string;
}

export interface TBRol {
  id_rol:      number;
  nombre_rol:  string;
  descripcion: string;
  estado:      boolean;
  id_permiso:  number;
}
