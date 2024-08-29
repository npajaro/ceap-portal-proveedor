import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-core-overlay-spinner',
  standalone: true,
  imports: [
    CommonModule, MatProgressBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './core-overlay-spinner.component.html',
  styleUrl: './core-overlay-spinner.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CoreOverlaySpinnerComponent {
  private spinnerSv = inject(SpinnerService);

  @Input() spinnerId!: string;
  @Input() spinnerType!: string;

  public isLoading$ = computed(() => this.spinnerSv.isLoading(this.spinnerId, this.spinnerType));
 }
