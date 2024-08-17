import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-certificado-retencion',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './certificado-retencion.component.html',
  styleUrl: './certificado-retencion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CertificadoRetencionComponent { }
