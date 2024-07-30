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
export class ModalActualizarDocumentosComponent { }
