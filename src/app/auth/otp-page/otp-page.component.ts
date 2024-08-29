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
import { CaptchaTurnstileComponent } from '@shared/components/captcha-turnstile/captcha-turnstile.component';


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
    MatFormFieldModule,
    CaptchaTurnstileComponent,
    ],
})
export class OtpPageComponent {
  @ViewChild('txtTagOtpInput') public tagOTP!: ElementRef<HTMLInputElement>;

  private coreSnackbarService   = inject(CoreSnackbarService);
  private router                = inject(Router);
  private authSv                = inject(AuthService);
  private cdRef                 = inject(ChangeDetectorRef);
  private spinnerSv             = inject(SpinnerService);
  private toastId               = ToastId;
  private lastOTPValue: string  = '';

  public dataTercero: Tercero = this.getTerceroFromLocalStorage();
  public turnstileToken!: string;

  countdown: number = 3;
  isResendDisabled: boolean = true;
  interval: any;

  ngOnInit() {
    this.startCountdown();
    console.log(this.dataTercero);
  }

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Remover cualquier carácter que no sea un número
    input.value = input.value.replace(/[^0-9]/g, '');

    // Llama a la función validateOTP después de filtrar los caracteres
    this.validateOTP();
  }

  onTokenReceived(token: string) {
    this.turnstileToken = token;
    this.dataTercero.captchaToken = token;
    localStorage.setItem('tercero', JSON.stringify(this.dataTercero));
    console.log({ token });
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
    this.spinnerSv.show('login', 'login');
    const bodyOtp = this.createOtpBody(otp);

    this.authSv.login(bodyOtp).subscribe({
      next: (data) => this.handleOtpSuccess(data),
      error: (error) => this.handleOtpError(error, 'send')
    });
  }

  resendOtp() {
    this.spinnerSv.show('login', 'login');
    const bodyOtp = this.createOtpBody();

    this.authSv.resendOtp(bodyOtp).subscribe({
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

  private getTerceroFromLocalStorage(): Tercero {
    const tercero = localStorage.getItem('tercero');
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
    this.spinnerSv.hide('login', 'login');
    console.log('Código OTP enviado correctamente', data);
    this.router.navigateByUrl('/dashboard');
  }

  private handleOtpError(error: any, action: 'send' | 'resend') {
    this.spinnerSv.hide('login', 'login');

    const errorCode = error.codigo || error.error.codigo;
    const errorMessage = this.getErrorMessage(errorCode, action);

    this.coreSnackbarService.openSnackbar(errorMessage, 'Cerrar', this.toastId.ERROR);
    console.error(errorMessage, error);

    if (errorCode === '408') {
      setTimeout(() => {
        this.refrehsPage();
      }, 2000)
    }
  }

  private getErrorMessage(errorCode: string, action: 'send' | 'resend'): string {
    switch (errorCode) {
      case '408':
        return 'El token del captcha ha expirado. Por favor, complete el desafío del captcha nuevamente.';
      case '409':
        return action === 'send' ? 'Código OTP inválido' : 'Espera unos segundos para volver a reenviar el código';
      default:
        return action === 'send' ? 'Error al enviar el código OTP' : 'Error al reenviar el código OTP';
    }
  }


  private handleResendOtpSuccess(data: any) {
    this.spinnerSv.hide('login', 'login');
    this.coreSnackbarService.openSnackbar(`Código OTP reenviado al correo ${this.dataTercero.email.toLowerCase()}`, 'Cerrar', this.toastId.SUCCESS);
    console.log(`Código OTP reenviado al correo ${this.dataTercero.email.toLowerCase()}`, data);
  }

  private refrehsPage() {
    // this.router.navigateByUrl("/auth/login");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  public onlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

}
