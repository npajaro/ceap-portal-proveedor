import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-core-overlay-spinner',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './core-overlay-spinner.component.html',
  styleUrl: './core-overlay-spinner.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CoreOverlaySpinnerComponent {
  private spinnerSv = inject(SpinnerService);


  public isLoading$        = this.spinnerSv.isLoading;
 }
