export interface Certificados {
  id:              string;
  tipoCertificado: string;
  ano:             string;
  periodo:         string;
  actions:         Action[];
  tercero:         string;
  ciudad:          string;
}

export interface Action {
  Compania_cia:      string;
  Ciudad_cia:        string;
  Direccion_cia:     string;
  Nit_cia:           string;
  Certificado:       string;
  Anio:              string;
  RazonSocial:       string;
  Nit:               string;
  Direccion:         string;
  Ciudad:            string;
  Concepto:          string;
  id_Auxiliar:       string;
  id_ClaseImpRet:    number;
  tasaImpuesto:      number;
  indTipoImpuesto:   number;
  DescAuxiliar:      string;
  ID_CO_DOCTO:       string;
  CONSECUTIVO_DOCTO: number;
  TIPO_DOCTO:        string;
  ID_PERIODO:        number;
  DB:                number;
  CR:                number;
  NETO:              number;
  BASE:              number;
}


export interface Parametros {
  fechaInicial: string;
  fechaFinal: string;
  termino: string;
  id?: string;
}


export enum Periodicity {
  BIMONTHLY = 'BIMONTHLY',
  YEARLY = 'YEARLY',
  YEARLY_ICA = 'YEARLY_ICA'
}
