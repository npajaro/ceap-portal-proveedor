import { CommonModule, NgClass, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DataDialogAlert } from '@interfaces/data-dialog.interface';
import { CoreDialogService } from '@services/core-dialog.service';
import { CoreSnackbarService } from '@services/core-snackbar.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    RouterLink,
    MatDivider,
    MatButton,
    NgClass,
    UpperCasePipe,
    MatIconModule,
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {

  private coreDialogSv                = inject(CoreDialogService);
  private coreSnackbarSv              = inject(CoreSnackbarService);
  public data: DataDialogAlert        = inject(MAT_DIALOG_DATA)
  public dialogRef                    = inject(MatDialogRef<ConfirmDialogComponent>)

  dialogId: string = '';
  constructor() {
    this.coreSnackbarSv.close()
  }


  ngOnInit(): void {
    this.dialogId = this.coreDialogSv.dialogId;
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

 }
