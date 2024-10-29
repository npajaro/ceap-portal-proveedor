import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-actualizar-documentos',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './modal-actualizar-documentos.component.html',
  styleUrl: './modal-actualizar-documentos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalActualizarDocumentosComponent {
  public onClick(): void {
    const mensaje = 'Hola Equipo de soporte, necesito actualizar mis documentos, por favor ayudame con este proceso.';
    const urlEmail = `mailto:developer@mrbono.co?subject=Solicitud actulizar datos&body=${encodeURIComponent(mensaje)}`
    window.open(urlEmail);
  }
}
