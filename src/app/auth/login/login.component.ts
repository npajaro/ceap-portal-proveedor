import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Tercero } from '@interfaces/tercero.interface';
import { ToastId } from '@interfaces/toast-Id.enum';
import { ApiService } from '@services/api.service';
import { ValidatorsService } from '@services/validators.service';
import { SpinnerService } from '@services/spinner.service';
import { CoreSnackbarService } from '@services/core-snackbar.service';
import { CaptchaTurnstileComponent } from '../../shared/components/captcha-turnstile/captcha-turnstile.component';
import { ModalActualizarDocumentosComponent } from '@auth/components/modal-actualizar-documentos/modal-actualizar-documentos.component';


@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    CaptchaTurnstileComponent
]
})
export class LoginComponent implements OnInit {

  private fb                    = inject(FormBuilder);
  private router                = inject(Router);
  private validatorsSv          = inject(ValidatorsService);
  private apiSv                 = inject(ApiService);
  private spinnerSv             = inject(SpinnerService);
  private coreSnackbarService   = inject(CoreSnackbarService);
  private dialog                = inject(MatDialog);
  private ToastId               = ToastId;

  public turnstileToken!: string;

  public loginForm: FormGroup = this.fb.group({
    numberNit: [ '', [Validators.required, Validators.minLength(6), Validators.maxLength(10)] ],
  })

  ngOnInit(): void {
    this.loginForm.reset();
  }

  onTokenReceived(token: string) {
    this.turnstileToken = token;
    console.log({ token });
  }

  // Métodos de validación del formulario
  public isValidField(field: string): boolean | null {
    return this.validatorsSv.isValidField(this.loginForm, field);
  }

  public getFieldError(field: string): string | null {
    return this.validatorsSv.getFieldError(this.loginForm, field);
  }


  // Métodos de autenticación
  public login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.checkIdentity(this.loginForm.get('numberNit')?.value || '');
  }

  public checkIdentity( nit: string) {
    this.spinnerSv.show();
    const bodyTercero = {
      captchaToken: this.turnstileToken,
      numeroIdentificacion: nit
    };
    if (!this.turnstileToken) {
      this.coreSnackbarService.openSnackbar('Captcha no resuelto, vamos a recargar la pagina', 'Cerrar', ToastId.ERROR);
      console.error('Captcha no resuelto, vamos a recargar la pagina');
      //* refrescar la pagina enseguida.
      setTimeout(() => {
        window.location.reload();
      }, 1000 )
      return;
    }

    if (nit === '') {
      console.error('El nit no puede estar vacio');
      return;
    }
    this.apiSv.checkIdentity(bodyTercero).subscribe({
      next: (data) => {
        const tercero: Tercero = {
          ...data,
          id: bodyTercero.numeroIdentificacion || '',
          captchaToken: bodyTercero.captchaToken || '',
        }
        sessionStorage.setItem('tercero', JSON.stringify(tercero));
        this.spinnerSv.hide();
        this.router.navigateByUrl('/auth/otp-validators');
        this.coreSnackbarService.close();
      },
      error: (error) => {
        this.loginForm.get('numberNit')?.setErrors({ invalidNit: 'true' });
        this.coreSnackbarService.openSnackbar('Error al obtener tercero', 'Cerrar', ToastId.ERROR, {});
        console.error('Error:', error);
        this.spinnerSv.hide();
      }
    });
  }

  //* Método para abrir modal
  public openModal(): void {
    const modalConfig = {
      width: '35vw',
      maxWidth: '50vw',
      height: 'auto',
      enterAnimationDuration: 300,
      exitAnimationDuration: 300,
    };
    const dialogRef = this.dialog.open(ModalActualizarDocumentosComponent, modalConfig);
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          console.log('The dialog was closed');
        }
        console.log('The dialog was closed');
      },
    });
  }

}
