import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SpinnerDownloadService } from '@services/spinner-download.service';

@Component({
  selector: 'app-core-overlay-spinner-download',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './core-overlay-spinner-download.component.html',
  styleUrl: './core-overlay-spinner-download.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CoreOverlaySpinnerDownloadComponent {
  private spinnerSv = inject(SpinnerDownloadService);


  public isLoading$        = this.spinnerSv.isLoading;
 }
