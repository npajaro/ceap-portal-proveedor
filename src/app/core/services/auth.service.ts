import { HttpClient } from '@angular/common/http';
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
  private redirecting = false;

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
    const dataUser = sessionStorage.getItem('tercero');
    if (dataUser) {
      const user = JSON.parse(dataUser);
      this._currentUser.set(user);
    }
  }

  public checkIdentity(body: { captchaToken: string,  numeroIdentificacion: string  }): Observable<Tercero> {
    const url = `${this.apiUrl}/api/public/tercero/identity-document`;
    console.log(body)

    return this.http.post<Tercero>(url, body)
  }

  private setAuthentication(response: CheckTokenResponseSuccess): boolean {
    const dataUser = sessionStorage.getItem('tercero');
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

  // public login(body: { otp: string,  numeroIdentificacion: string, captchaToken: string  }){
  //   const url = `${this.apiUrl}/api/public/tercero/validar-otp`;
  //   console.log(body)

  //   return this.http.post(url, body)
  //   .pipe(
  //     tap((response: any) => {
  //       if (response.token) {
  //         this.setToken(response.token)
  //         this.router.navigateByUrl('/dashboard');
  //       }
  //     }),
  //     catchError((error: any) => {
  //       console.error(error)
  //       return error
  //     })
  //   );
  // }

  // public logout() {
  //   this.removeToken();
  //   this.router.navigateByUrl('/auth/login')
  // }

  // public isAuthenticated(): boolean {
  //   const token = this.getToken();
  //   return token !== null;
  // }

  // public setToken(token: string) {
  //   localStorage.setItem(this.tokenKey, token)
  // }

  // public getToken(): string | null {
  //   return localStorage.getItem(this.tokenKey);
  // }

  // public removeToken() {
  //   localStorage.removeItem(this.tokenKey);
  // }
}
