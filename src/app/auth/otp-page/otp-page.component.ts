import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, NgModule, ViewChild } from '@angular/core';
import { TruncatePipe } from '@pipes/truncate.pipe';
import { CoreSnackbarService } from '@services/core-snackbar.service';
import { ToastId } from '../../core/interfaces/toast-Id.enum';

@Component({
    selector: 'app-otp-page',
    standalone: true,
    templateUrl: './otp-page.component.html',
    styleUrl: './otp-page.component.css',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        TruncatePipe,
    ],
})
export class OtpPageComponent {
  @ViewChild('otpInput1') otpInput1!: ElementRef;
  @ViewChild('otpInput2') otpInput2!: ElementRef;
  @ViewChild('otpInput3') otpInput3!: ElementRef;
  @ViewChild('otpInput4') otpInput4!: ElementRef;

  private coreSncakbarSv = inject(CoreSnackbarService);
  private ToastId = ToastId;

  otp: string[] = ['', '', '', ''];

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

  // Optener el valor del OTP para luego enviarlo al servidor

  getOtp() {
    return [
      this.otpInput1.nativeElement.value,
      this.otpInput2.nativeElement.value,
      this.otpInput3.nativeElement.value,
      this.otpInput4.nativeElement.value,
    ].join('');
  }

  // Enviar el OTP al servidor

  sendOtp() {
    // Validar que los 4 campos esten llenos
    if (this.getOtp().length < 4) {
      this.coreSncakbarSv.openSuccess('Debe llenar todos los campos', 'Cerrar', ToastId.ERROR);
      console.log('Debe llenar todos los campos');
      return;
    }


    console.log('OTP:', this.getOtp());
  }


}
