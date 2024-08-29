import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Subscription, filter } from 'rxjs';



import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CoreDialogService } from '@services/core-dialog.service';
import { AuthStatus } from '@interfaces/auth.interfaces';
import { SpinnerService } from '@services/spinner.service';
import { CoreOverlaySpinnerComponent } from "./shared/components/core-overlay-spinner/core-overlay-spinner.component";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatProgressBarModule, CoreOverlaySpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  private router        = inject(Router);
  private spinnerSv     = inject(SpinnerService);
  private coreDialogSv  = inject(CoreDialogService);
  private authSv        = inject(AuthService);
  private inactivityTimeout: any;
  private inactivityTime = 10 * 60 * 1000 // 5 minutos en milisegundo
  private isDialogOpen = false;
  public titleSub$!: Subscription;

  title = ''


  constructor() {
    this.titleSub$ = this.argumentoRuta()
  }

  ngOnInit(): void {
    this.checkInitialSession();
    if (this.isAuthenticated()) {
      this.checkSession();
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !document.hidden) {
        this.checkSession(false);
      }
    });
  }

  ngOnDestroy(): void {
    // window.removeEventListener('focus', () => this.checkSession());
    this.titleSub$.unsubscribe();
  }


  private checkInitialSession() {
    const isTokenValid = localStorage.getItem('isTokenValid') === 'true';

    if (this.isAuthenticated() && !isTokenValid) {
      this.showSessionExpiredDialog();
    }
  }


  private checkSession(isLoading: boolean = true) {
    const isAuth = this.isAuthenticated();

    if (isLoading && isAuth) {
      this.spinnerSv.show('checkSession', 'global');
    }


    if (this.isAuthenticated()) {
      this.authSv.checkToken().subscribe((isValid) => {
        // localStorage.setItem('isTokenValid', isValid.toString());
        this.spinnerSv.hide('checkSession', 'global');
        if (!isValid) {
          // localStorage.setItem('sessionExpired', 'true');
          // this.showSessionExpiredDialog();
          this.delaySessionCheckAndShowDialog(isValid);
        }
      });
    }
  }

  private delaySessionCheckAndShowDialog(isValid:boolean) {
    setTimeout(() => {
      localStorage.setItem('isTokenValid', isValid.toString());
      const isTokenValid = localStorage.getItem('isTokenValid') === 'true';
      if (!isTokenValid) {
        this.showSessionExpiredDialog();
      }
    }, 100);
  }

  private showSessionExpiredDialog() {
    if (!this.isDialogOpen && this.isAuthenticated()) {
      this.isDialogOpen = true;
      const dialog = this.coreDialogSv.openDialogAlert(
        'Sesión expirada',
        'Su sesión ha expirado debido a la inactividad o token vencido. Por favor, inicie sesión nuevamente.',
        'logout', 'verde', 'Cerrar', '',
      );
      dialog.afterClosed().subscribe(result => {
        if (result) {
          this.doLogout();
        }
        this.isDialogOpen = false;
        // localStorage.removeItem('sessionExpired');
      });
    }
  }

  private isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const currentRoute = this.router.url;
    return token !== null && !['/auth'].includes(currentRoute);
  }

  doLogout() {
    this.authSv.logout();
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  public argumentoRuta() {
    return this.router.events
    .pipe(
      filter((event: any) => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
    ).subscribe((data) => {
      console.log('Data',data);
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
