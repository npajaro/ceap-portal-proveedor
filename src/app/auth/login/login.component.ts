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

  public tercero!: Tercero;
  public turnstileToken!: string;

  public loginForm: FormGroup = this.fb.group({
    numberNit: [ '', [Validators.required, Validators.minLength(6), Validators.maxLength(10)] ],
  })

  ngOnInit(): void {
    this.loginForm.reset();
  }


  onTokenReceived(token: string) {
    this.turnstileToken = token;
  }


  public isValidField ( field: string) {
    return this.validatorsSv.isValidField( this.loginForm, field)
  }

  public getFieldError( field: string ) {
    return this.validatorsSv.getFieldError(this.loginForm, field)
  }

  public login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const nit = this.loginForm.get('numberNit')?.value || '';
    this.getTercero(nit)
  }

  public getTercero( nit: string) {
    this.spinnerSv.show();
    if (this.turnstileToken) {
      console.log('Turnstile Token:', this.turnstileToken);
    } else {
      this.coreSnackbarService.openSnackbar('Captcha no resuelto', 'Cerrar', ToastId.ERROR);
      console.error('Captcha no resuelto');
      return;
    }

    if (nit === '') {
      console.error('El nit no puede estar vacio');
      return;
    }
    this.apiSv.getTercero(nit).subscribe({
      next: (data) => {
        this.tercero = data;
        localStorage.setItem('tercero', JSON.stringify(this.tercero));
        // console.log('Tercero:', this.tercero);
        this.spinnerSv.hide();
        // this.router.navigate(['/auth/otp-validators'])
        this.router.navigateByUrl('/auth/otp-validators');
        this.coreSnackbarService.close();
      },
      error: (error) => {
        this.loginForm.get('numberNit')?.setErrors({ invalidNit: 'true' });
        this.coreSnackbarService.openSnackbar('Error al obtener tercero', 'Cerrar', ToastId.ERROR);
        console.log('Error:', error);
        this.spinnerSv.hide();
      }
    });
  }

  // abril modal para actualizar documentos de tercero
  public openModal() {
    const AbrilModal = {
      width: '35vw',
      maxWidth: '50vw',
      height: 'auto',
      enterAnimationDuration: 300,
      exitAnimationDuration: 300,
      // autoFocus: false,
    }

    const dialogRef = this.dialog.open(ModalActualizarDocumentosComponent, AbrilModal);
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          console.log('The dialog was closed');
        }
        console.log('The dialog was closed');
      }
    });
  }


}
