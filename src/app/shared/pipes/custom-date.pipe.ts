import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'customDate',
    standalone: true
})
export class CustomDatePipe implements PipeTransform {

  // Pipe personalizado para formatear fechas en el formato ddmmyyyy

  transform(value: string | Date): string {

    if (value) {
      const date = new Date(value);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day < 10 ? '0' + day : day}${month < 10 ? '0' + month : month}${year}`;
    }
    return '';
  }

}
