export interface Tercero {
  codigo:  number;
  mensaje: string;
  detalle: Detalle;
}

export interface Detalle {
  Table: Table[];
}

export interface Table {
  f200_id_cia:        number;
  f200_rowid:         number;
  f200_id:            string;
  f200_nit:           string;
  f200_dv_nit:        null;
  f200_id_tipo_ident: string;
  f200_razon_social:  string;
  f200_apellido1:     string;
  f200_apellido2:     string;
  f200_nombres:       string;
  f200_ind_estado:    number;
  f015_id_pais:       string;
  f015_id_depto:      string;
  f015_id_ciudad:     string;
  f015_email:         string;
  f015_contacto:      string;
  f015_direccion1:    string;
  f015_direccion2:    string;
  f015_telefono:      string;
  f015_celular:       string;
}
