import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'TransformarPeriodo',
  standalone: true,
})
export class TransformarPeriodoPipe implements PipeTransform {

  transform(value: string): string {

    const regex = /Bimestral\s-\s\((\d{6})\s-\s(\d{6})\)/;
    const match = value.match(regex);

    if (!match) {
      return value;
    }

    const inicio = match[1];
    const fin = match[2];

    const bimestre = Math.floor((parseInt(inicio.substring(4, 6), 10) - 1) / 2) + 1;

    const meses: { [key: string]: string } = {
      '01': 'ENE',
      '02': 'FEB',
      '03': 'MAR',
      '04': 'ABR',
      '05': 'MAY',
      '06': 'JUN',
      '07': 'JUL',
      '08': 'AGO',
      '09': 'SEP',
      '10': 'OCT',
      '11': 'NOV',
      '12': 'DIC',
    };

    const anioInicio = inicio.substring(0, 4);
    const mesinicio = inicio.substring(4, 6);
    const anioFin = fin.substring(0, 4);
    const mesFin = fin.substring(4, 6);

    return `B${bimestre} (${meses[mesinicio]}-${meses[mesFin]} ${anioInicio})`;

  }

}
