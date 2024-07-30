import { Component, OnDestroy, inject } from '@angular/core';
import { ActivationEnd, Router, RouterOutlet } from '@angular/router';
import { Subscription, filter } from 'rxjs';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  private router = inject(Router);

  public titleSub$!: Subscription;

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
