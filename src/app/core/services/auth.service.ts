import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { AuthStatus, CheckTokenResponse, CheckTokenResponseSuccess, User } from '@interfaces/auth.interfaces';
import { Tercero } from '@interfaces/tercero.interface';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http    = inject(HttpClient);
  private router  = inject(Router);
  private readonly apiUrl  = environment.API_URL;

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser  = computed(() => this._currentUser());
  public authStatus   = computed(() => this._authStatus());

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      this._authStatus.set(AuthStatus.authenticated);
    } else {
      this._authStatus.set(AuthStatus.notAuthenticated);
    }
    this.initializeUserFromLocalStorage();

   }


  public initializeUserFromLocalStorage() {
    const dataUser = localStorage.getItem('tercero');
    if (dataUser) {
      const user = JSON.parse(dataUser);
      this._currentUser.set(user);
    }
  }

  public checkToken(): Observable<Boolean> {
    const url = `${this.apiUrl}/api/auth/status`;
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('sin token')
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http.get<any>(url, {headers}).pipe(
      map((response) => {
        console.log(response)
        if (response.status === 200) {
          return response.status === 200;
        } else {
          console.log('false auth')
          return false;
        }
      }),
      catchError((e: any) => {
        if (e.status === 200) {
          return of(true);
        } else if (e.status === 401) {
          return of(false);
        } else {
          return of(false);
        }
      })
    );
  }

  public checkIdentity(body: { captchaToken: string,  numeroIdentificacion: string  }): Observable<Tercero> {
    const url = `${this.apiUrl}/api/public/tercero/identity-document`;
    // console.log(body)

    return this.http.post<Tercero>(url, body)
  }

  public resendOtp(body: { captchaToken: string,  numeroIdentificacion: string  }) {
    const url = `${this.apiUrl}/api/public/tercero/resend-otp`;
    // console.log(body)

    return this.http.post<Tercero>(url, body)
  }

  private setAuthentication(response: CheckTokenResponseSuccess): boolean {
    const dataUser = localStorage.getItem('tercero');
    if (!dataUser) {
      return false;
    } else {
      const user = JSON.parse(dataUser);
      this._currentUser.set(user);
      this._authStatus.set(AuthStatus.authenticated);
      localStorage.setItem('token', response.token);
      return true;
    }
  }

  login(body: { otp: string,  numeroIdentificacion: string, captchaToken: string  }): Observable<boolean> {
    const url = `${this.apiUrl}/api/public/tercero/validar-otp`;

    return this.http.post<any>(url, body).pipe(
      map((response) => {
        this._currentUser.set(response);
        this.setAuthentication(response);
        return true;
      }),
      catchError(err => {
        return throwError(() => err.error);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    this.router.navigateByUrl('/auth/login');
  }

}
