import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Subscription, filter } from 'rxjs';



import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CoreDialogService } from '@services/core-dialog.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { AuthStatus } from '@interfaces/auth.interfaces';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingSpinnerComponent, MatProgressBarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  private router        = inject(Router);
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
    this.checkSession();
    this.startInactivityTimer();
    // window.addEventListener('focus', () => this.checkSession());

    // document.addEventListener('visibilitychange', () => {
    //   if (document.visibilityState === 'visible') {
    //     this.checkSession();
    //   }
    // }, false);

    // window.addEventListener('focus', () => {
    //   if (document.hasFocus() && document.visibilityState === 'visible') {
    //     console.log('entreeeeee')
    //     this.checkSession();
    //   }
    // });

    // document.addEventListener('visibilitychange', () => {
    //   if (document.visibilityState === 'visible') {
    //     // console.log('ingreseee')
    //     this.checkSession();
    //   }
    // });

    // document.addEventListener('visibilitychange', () => {
    //   if (document.visibilityState === 'visible' && !document.hidden) {
    //     this.checkSession();
    //   }
    // });
  }

  ngOnDestroy(): void {
    window.removeEventListener('focus', () => this.checkSession());
    this.titleSub$.unsubscribe();
  }

  public finishedAuthCheck = computed<boolean>(() => {
    const authStatus = this.authSv.authStatus();

    if (authStatus === AuthStatus.checking) {
      return false; // Todavía estamos verificando el estado de autenticación
    } else if (authStatus === AuthStatus.notAuthenticated) {
      if (!['/auth/login', '/auth/otp-validator'].includes(this.router.url)) {
        this.showSessionExpiredDialog();
      }
      return true; // Se ha determinado que no está autenticado
    }

    return true; // Está autenticado
  });


  private checkInitialSession() {
    const lastActivity = localStorage.getItem('lastActivity');
    const isTokenValid = localStorage.getItem('isTokenValid') === 'true';
    const sessionExpired = localStorage.getItem('sessionExpired') === 'true';

    if (this.isAuthenticated() && sessionExpired) {
      this.showSessionExpiredDialog();
    }
    else if (this.isAuthenticated() && lastActivity && Date.now() - parseInt(lastActivity, 10) > this.inactivityTime) {
    this.showSessionExpiredDialog();
    }
    else if (this.isAuthenticated() && !isTokenValid) {
      this.showSessionExpiredDialog();
    }
  }

  private startInactivityTimer() {
    this.resetInactivityTimer();
    document.addEventListener('mousemove', () => this.resetInactivityTimer());
    document.addEventListener('keypress', () => this.resetInactivityTimer());
    document.addEventListener('scroll', () => this.resetInactivityTimer());
    document.addEventListener('keydown', () => this.resetInactivityTimer());
    document.addEventListener('click', () => this.resetInactivityTimer());
    document.addEventListener('touchstart', () => this.resetInactivityTimer());
    document.addEventListener('touchmove', () => this.resetInactivityTimer());
  }

  private resetInactivityTimer() {
    clearTimeout(this.inactivityTimeout);
    localStorage.setItem('lastActivity', Date.now().toString());
    this.inactivityTimeout = setTimeout(() => {
      if (this.isAuthenticated()) {
        localStorage.setItem('sessionExpired', 'true');
        this.showSessionExpiredDialog();
      }
    }, this.inactivityTime);
  }

  // funcion para validar checkSession y con base en eso mostrar loadind mientras se valida
  public loading = computed(() => {
    if (this.finishedAuthCheck()) {
      return false;
    } else {
      return true;
    }
  });


  private checkSession() {
    if (this.isAuthenticated()) {
      this.authSv.checkToken().subscribe((isValid) => {
        localStorage.setItem('isTokenValid', isValid.toString());
        if (!isValid) {
          localStorage.setItem('sessionExpired', 'true');
          this.showSessionExpiredDialog();
        }
      });
    }
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
        localStorage.removeItem('sessionExpired');
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
