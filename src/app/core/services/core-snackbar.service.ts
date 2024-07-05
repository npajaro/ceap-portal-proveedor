import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastId } from '@interfaces/toast-Id.enum';
import { CustomSnackbarComponent } from 'src/app/shared/components/custom-snackbar/custom-snackbar.component';


@Injectable({providedIn: 'root'})
export class CoreSnackbarService {
  toastId: string = '';

  private _snackBar = inject(MatSnackBar);

  openSuccess(message: string, action: string, toastId: ToastId) {
    this.toastId = toastId;
    this._snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        message,
        action,
        toastId,
        type: toastId,
        snackBar: this._snackBar
      },
      panelClass: [`${toastId}-snackbar`],
      // duration: 4500,
      verticalPosition: 'bottom',
      horizontalPosition: 'left'
    });
  }

  close() {
    this._snackBar.dismiss();
  }


}
