import type { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { CoreDialogService } from './core-dialog.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(catchError(handlerErrorResponse));
};

function handlerErrorResponse(error: HttpErrorResponse) {
  console.log('error', error);

  const status = error.status;
  const coreDialogSv = inject(CoreDialogService);
  const authService = inject(AuthService); // Inyecta el servicio de autenticación
  const router = inject(Router);

  if (status === 401) {
    console.log('401')
    const dialog = coreDialogSv.openDialogAlert(
      'Sesión expirada 100',
      'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
      'logout', 'verde', 'Cerrar', '',
    );
    dialog.afterClosed().subscribe(result => {
      if (result) {
        authService.logout();
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
      localStorage.removeItem('sessionExpired');
    });

  }

  const errorResponse = {status, message: 'Unauthorized', error: error};
  console.error('ErrorResponse', errorResponse);


  return throwError(() => errorResponse);
}


