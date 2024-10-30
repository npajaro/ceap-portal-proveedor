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
  public readonly EMAIL = 'developer@mrbono.co';
  private readonly SUBJECT = 'Solicitud actulizar datos';
  private readonly MESSAGE = 'Hola Equipo de soporte, necesito actualizar mis documentos, por favor ayudame con este proceso.';

  public onClick(): void {
    const urlEmail = this.buildEmailUrl();
    window.open(urlEmail);
  }

  private buildEmailUrl(): string {
    return `mailto:${this.EMAIL}?subject=${this.SUBJECT}&body=${encodeURIComponent(this.MESSAGE)}`;
  }
}
