import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { ToastId } from '@interfaces/toast-Id.enum';
import { CoreSnackbarService } from '@services/core-snackbar.service';

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './custom-snackbar.component.html',
  styleUrl: './custom-snackbar.component.css',
})
export class CustomSnackbarComponent implements OnInit {

  public data: any         = inject(MAT_SNACK_BAR_DATA);

  typeToastId = ToastId;
  toastId: string = '';

  ngOnInit(): void {
    this.toastId = this.data.toastId;
  }

  closeSnackBar() {
    this.data.snackBar.dismiss();
  }
}
