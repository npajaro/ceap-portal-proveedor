import { AsyncPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [
    AsyncPipe, MatProgressBarModule
  ],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css',
})
export class LoadingSpinnerComponent {
  @Input() progressValue: number | undefined;
  private spinnerSv = inject(SpinnerService);

  isLoading = this.spinnerSv.isLoading;



 }
