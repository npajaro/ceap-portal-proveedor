import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, NgModule, ViewChild } from '@angular/core';
import { TruncatePipe } from '@pipes/truncate.pipe';
import { CoreSnackbarService } from '@services/core-snackbar.service';
import { ToastId } from '../../core/interfaces/toast-Id.enum';
import { MatButtonModule } from '@angular/material/button';
import { Tercero } from '@interfaces/tercero.interface';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SpinnerService } from '@services/spinner.service';
import { ApiService } from '@services/api.service';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
    selector: 'app-otp-page',
    standalone: true,
    templateUrl: './otp-page.component.html',
    styleUrl: './otp-page.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        TruncatePipe,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule
    ],
})
export class OtpPageComponent {
  @ViewChild('txtTagOtpInput') public tagOTP!: ElementRef<HTMLInputElement>;

  private coreSnackbarService   = inject(CoreSnackbarService);
  private router                = inject(Router);
  private apiSv                 = inject(ApiService);
  private authSv                = inject(AuthService);
  private cdRef                 = inject(ChangeDetectorRef);
  private spinnerSv             = inject(SpinnerService);
  private toastId               = ToastId;
  private lastOTPValue: string  = '';

  public dataTercero: Tercero = this.getTerceroFromSessionStorage();

  countdown: number = 3;
  isResendDisabled: boolean = true;
  interval: any;

  ngOnInit() {
    this.startCountdown();
    console.log(this.dataTercero);
  }

  public validateOTP() {
    const tagOTP = this.tagOTP.nativeElement.value.trim();

    // Verificar si el valor del input ha cambiado
    if (tagOTP !== this.lastOTPValue) {
      this.lastOTPValue = tagOTP;

      if (tagOTP.length === 6) {
        console.warn('El código OTP es correcto', { tagOTP });
        this.sendOtp(tagOTP);
      }
    }
    // Actualizar el valor del input sin espacios
    this.tagOTP.nativeElement.value = tagOTP;
  }

  sendOtp(otp: string) {
    this.spinnerSv.show();
    const bodyOtp = this.createOtpBody(otp);

    this.authSv.login(bodyOtp).subscribe({
      next: (data) => this.handleOtpSuccess(data),
      error: (error) => this.handleOtpError(error, 'send')
    });
  }

  resendOtp() {
    this.spinnerSv.show();
    const bodyOtp = this.createOtpBody();

    this.apiSv.resendOtp(bodyOtp).subscribe({
      next: (data) => this.handleResendOtpSuccess(data),
      error: (error) => this.handleOtpError(error, 'resend')
    });

    this.resetCountdown();
  }

  startCountdown() {
    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.isResendDisabled = false;
        clearInterval(this.interval);
      }
      this.cdRef.markForCheck();
    }, 1000);
  }

  resetCountdown() {
    this.countdown = 3;
    this.isResendDisabled = true;
    this.startCountdown();
  }

  private getTerceroFromSessionStorage(): Tercero {
    const tercero = sessionStorage.getItem('tercero');
    return tercero ? JSON.parse(tercero) : {};
  }

  private createOtpBody(otp?: string): any {
    return {
      otp: otp,
      numeroIdentificacion: this.dataTercero?.id || '',
      captchaToken: this.dataTercero?.captchaToken || '',
    };
  }

  private handleOtpSuccess(data: any) {
    this.spinnerSv.hide();
    console.log('Código OTP enviado correctamente', data);
    this.router.navigateByUrl('/dashboard');
  }

  private handleOtpError(error: any, action: 'send' | 'resend') {
    this.spinnerSv.hide();
    console.log(error)
    if (error.status === 408 || (error && error.coidgo === '408')) {
      this.coreSnackbarService.openSnackbar('El token del captcha ha expirado. Por favor, complete el desafío del captcha nuevamente.', 'Cerrar', this.toastId.ERROR);
      console.error('El token del captcha ha expirado.');
      this.navigateToLogin();
    } else if (error && error.codigo === '409' ) {
      this.coreSnackbarService.openSnackbar('Código OTP inválido', 'Cerrar', this.toastId.ERROR);
      console.error('Código OTP inválido', error);
    } else {
      const errorMessage = action === 'send' ? 'Error al enviar el código OTP' : 'Error al reenviar el código OTP';
      console.error(errorMessage, error);
      this.coreSnackbarService.openSnackbar(errorMessage, 'Cerrar', this.toastId.ERROR);
    }
  }


  private handleResendOtpSuccess(data: any) {
    this.spinnerSv.hide();
    this.coreSnackbarService.openSnackbar(`Código OTP reenviado al correo ${this.dataTercero.email.toLowerCase()}`, 'Cerrar', this.toastId.SUCCESS);
    console.log(`Código OTP reenviado al correo ${this.dataTercero.email.toLowerCase()}`, data);
  }

  private navigateToLogin() {
    this.router.navigateByUrl("/auth/login");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

}
