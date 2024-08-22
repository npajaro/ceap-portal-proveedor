import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Tercero } from '@interfaces/tercero.interface';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http    = inject(HttpClient);
  private router  = inject(Router);
  private readonly apiUrl  = environment.API_URL;
  private tokenKey = 'jwToken'

  constructor() { }

  public checkIdentity(body: { captchaToken: string,  numeroIdentificacion: string  }): Observable<Tercero> {
    const url = `${this.apiUrl}/api/public/tercero/identity-document`;
    console.log(body)

    return this.http.post<Tercero>(url, body)
  }

  public login(body: { otp: string,  numeroIdentificacion: string, captchaToken: string  }){
    const url = `${this.apiUrl}/api/public/tercero/validar-otp`;
    console.log(body)

    return this.http.post(url, body)
    .pipe(
      tap((response: any) => {
        if (response.token) {
          this.setToken(response.token)
          this.router.navigateByUrl('/dashboard');
        }
      }),
      catchError((error: any) => {
        console.error(error)
        return error
      })
    );
  }

  public logout() {
    this.removeToken();
    this.router.navigateByUrl('/auth/login')
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  public setToken(token: string) {
    localStorage.setItem(this.tokenKey, token)
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public removeToken() {
    localStorage.removeItem(this.tokenKey);
  }
}
