import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagos-recibidos',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCard,
  ],
  templateUrl: './pagos-recibidos.component.html',
  styleUrl: './pagos-recibidos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PagosRecibidosComponent { }
