import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, NgModule, ViewChild } from '@angular/core';
import { TruncatePipe } from '@pipes/truncate.pipe';
import { CoreSnackbarService } from '@services/core-snackbar.service';
import { ToastId } from '../../core/interfaces/toast-Id.enum';
import { MatButtonModule } from '@angular/material/button';
import { Tercero } from '@interfaces/tercero.interface';

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
    ],
})
export class OtpPageComponent {
  @ViewChild('otpInput1') otpInput1!: ElementRef;
  @ViewChild('otpInput2') otpInput2!: ElementRef;
  @ViewChild('otpInput3') otpInput3!: ElementRef;
  @ViewChild('otpInput4') otpInput4!: ElementRef;

  private coreSnackbarService   = inject(CoreSnackbarService);
  private cdRef                 = inject(ChangeDetectorRef);
  private ToastId               = ToastId;

  public dataTercero: Tercero = localStorage.getItem('tercero') ? JSON.parse(localStorage.getItem('tercero') as string) : {};

  otp: string[] = ['', '', '', ''];
  countdown: number = 120;
  isResendDisabled: boolean = true;
  interval: any;

  ngOnInit() {
    // this.startCountdown();
    this.startCountdown();
    console.log(this.dataTercero);
  }

  moveFocus(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1) {
      if (index < 3) {
        const nextInput = input.nextElementSibling as HTMLInputElement;
        nextInput?.focus();
      }
    } else if (input.value.length === 0 && event.key === 'Backspace' && index > 0) {
      const prevInput = input.previousElementSibling as HTMLInputElement;
      prevInput?.focus();
    }
  }

  getOtp() {
    return [
      this.otpInput1.nativeElement.value,
      this.otpInput2.nativeElement.value,
      this.otpInput3.nativeElement.value,
      this.otpInput4.nativeElement.value,
    ].join('');
  }

  sendOtp() {
    if (this.getOtp().length < 4) {
      this.coreSnackbarService.openSnackbar('Debe ingresar OTP', 'Cerrar', this.ToastId.WARNING);
      console.log('Debe llenar todos los campos');
      return;
    }
    this.coreSnackbarService.close();
    // this.startCountdown();
    console.log('OTP:', this.getOtp());
  }

  requestNewCode() {
    this.coreSnackbarService.openSnackbar(`Código OTP reenviado al corrreo ${this.dataTercero.email.toLowerCase()}`, 'Cerrar', this.ToastId.SUCCESS);
    console.log('¿Estás seguro de que quieres solicitar un nuevo código?');
    this.resetCountdown();
  }

  resendOtp() {
    if (this.getOtp().length > 0) {
      this.coreSnackbarService.openSnackbar('¿Estás seguro de que quieres reenviar el OTP?', 'Reenviar', this.ToastId.SUCCESS);
      console.log('¿Estás seguro de que quieres reenviar el OTP?');
      return;
    }
    this.coreSnackbarService.close();
    console.log('Reenviar OTP', this.getOtp());
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
      this.cdRef.markForCheck(); // Marca el componente para verificar cambios
    }, 1000);
  }

  resetCountdown() {
    this.countdown = 120;
    this.isResendDisabled = true;
    this.startCountdown();
  }


}
