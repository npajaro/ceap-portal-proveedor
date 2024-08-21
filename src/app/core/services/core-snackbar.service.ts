import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastId } from '@interfaces/toast-Id.enum';
import { CustomSnackbarComponent } from 'src/app/shared/components/custom-snackbar/custom-snackbar.component';


@Injectable({providedIn: 'root'})
export class CoreSnackbarService {
  toastId: string = '';

  private _snackBar = inject(MatSnackBar);

  openSnackbar(message: string, action: string, toastId: ToastId, options?: {
    duration?: number,
    panelClass?: string[],
    verticalPosition?: 'top' | 'bottom',
    horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right'
  }) {
    this.toastId = toastId;
    this._snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        message,
        action,
        toastId,
        type: toastId,
        snackBar: this._snackBar
      },
      panelClass: options?.panelClass || [`${toastId}-snackbar`],
      duration: options?.duration || 10000, // Duración predeterminada de 3000 ms (3 segundos)
      verticalPosition: options?.verticalPosition || 'bottom',
      horizontalPosition: options?.horizontalPosition || 'left'
    });
  }

  close() {
    this._snackBar.dismiss();
  }


}
