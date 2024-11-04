export interface Tercero {
  estado: string,
  name: string,
  email: string,
  id?: string
  captchaToken?: string
}


export interface DataProveedor {
  config: null;
  meta:   null;
  data:   Proveedor;
}

export interface Proveedor {
  F202_ID_TERCERO:               string;
  F202_ID_SUCURSAL:              string;
  F202_IND_ESTADO:               number;
  F202_DESCRIPCION_SUCURSAL:     string;
  F202_ID_MONEDA:                string;
  F202_ID_CLASE_PROVEEDOR:       string;
  F202_ID_COND_PAGO:             string;
  F202_DIAS_GRACIA:              number;
  F202_CUPO_CREDITO:             number;
  F202_ID_TIPO_PROV:             string;
  F202_IND_FORMA_PAGO:           number;
  F202_NOTAS:                    string;
  F015_CONTACTO:                 string;
  F015_DIRECCION1:               string;
  F015_DIRECCION2:               string;
  F015_DIRECCION3:               string;
  F015_ID_PAIS:                  string;
  F015_ID_DEPTO:                 string;
  F015_ID_CIUDAD:                string;
  F015_ID_BARRIO:                string;
  F015_TELEFONO:                 string;
  F015_FAX:                      string;
  F015_COD_POSTAL:               string;
  F015_EMAIL:                    string;
  F202_FECHA_INGRESO:            string;
  F202_PORCENTAJE_EXCESO_COMPRA: number;
  F202_MONTO_ANUAL_COMPRA:       number;
  F202_IND_MONTO_ANUAL_COMPRA:   number;
  f202_IND_EXIGE_COTIZ_EN_OC:    number;
  f202_IND_EXIGE_OC_EN_EA:       number;
  f202_IND_OC_EXIGE_EDI:         number;
  F202_ID_GRUPO_CO_CM:           null;
  F015_CELULAR:                  string;
  f202_ind_defecto_pe_trco:      number;
  f202_ind_exige_consig:         number;
  F_CIA:                         number;
  F_ACTUALIZA_REG:               string;
}
