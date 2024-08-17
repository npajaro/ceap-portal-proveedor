import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-pagos-recibidos',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './pagos-recibidos.component.html',
  styleUrl: './pagos-recibidos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PagosRecibidosComponent { }
