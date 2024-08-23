import { inject, Injectable } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';





@Injectable({
  providedIn: 'root'
})
export class CoreDialogService {
  private _dialog = inject(MatDialog)

  dialogId: string = '';

  constructor() { }

  openDialogAlert(title: string, message: string, icon: string, colorIcon: string = 'amarillo', confirmButtonText: string, cancelButtonText: string): MatDialogRef<ConfirmDialogComponent> {
    this.dialogId = 'dialog-alert';
    const AbrilDialog = {
      data: {
        title: title,
        message: message,
        colorIcon: colorIcon,
        icon: icon,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        dialog: this._dialog
      },
      width: '85dvw',
      // maxWidth: '90vw',
      height: 'auto',
      disableClose: true,
      enterAnimationDuration: 300,
      exitAnimationDuration: 300,
      // panelClass: ['scale-up-center'],
    }
    return this._dialog.open(ConfirmDialogComponent, AbrilDialog);
  }

}
