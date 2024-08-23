import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { ActivationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Subscription, filter } from 'rxjs';
import { LoadingSpinnerComponent } from "./shared/components/loading-spinner/loading-spinner.component";
import { MatProgressBarModule } from '@angular/material/progress-bar';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingSpinnerComponent, MatProgressBarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  private router = inject(Router);
  title = ''

  public titleSub$!: Subscription;

  private authService = inject(AuthService);

  constructor() {
    this.titleSub$ = this.argumentoRuta()
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  public argumentoRuta() {
    return this.router.events
    .pipe(
      filter((event: any) => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
    ).subscribe((data) => {
      console.log(data);
      document.title = `CEAP - ${data.snapshot.data['title']}`;
    })
  }

  loadCaptchaScript() {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }
}
