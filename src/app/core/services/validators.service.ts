import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  public emailPattern:  string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";


  public isValidField( form: FormGroup, field: string ) {
    return form.controls[field].errors && form.controls[field].touched;
  }

  public getFieldError( form: FormGroup, field: string ): string | null {
    if ( !form.controls[field] ) return null;

    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch ( key ) {
        case 'required':
          return 'Este campo es requerido';
        case 'email':
          return 'Invalid email';
        case 'minlength':
          return `Este campo debe tener al menos ${errors['minlength'].requiredLength} caracteres`;
        case 'maxlength':
          return `Este campo debe tener como máximo ${errors['maxlength'].requiredLength} caracteres`;
        case 'invalidNit':
          return 'Error en este campo';
        case 'pattern':
            if ( field === 'email' ) {
              return 'El formato del correo es incorrecto.';
            } else if ( field === 'numberNit' ) {
              return 'Debe digitar solo números.';
            } else if ( field === 'noIdentification' ) {
              return 'Debe digitar solo números.';
            } else if ( field === 'password' ) {
              return 'Debe contener al menos un caracter minusculas<, mayuscula y numeros.';
            } else {
              return `Error en el campo ${field}.`;
            }
        default:
          return `Error en el campo ${field}.`;
      }
    }
    return null;
  }

}
