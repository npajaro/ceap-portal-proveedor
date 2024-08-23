import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Tercero } from '@interfaces/tercero.interface';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})

export class ApiService {

  private http    = inject(HttpClient);
  private apiUrl  = environment.API_URL;


  // private getAuthHeaders() {
  //   const headers = new HttpHeaders({
  //     'conniKey': environment.CONNIKEY,
  //     'conniToken': environment.CONNITOKEN
  //   });

  //   return { headers };
  // }


  // public getTercero(nit: string): Observable<Tercero> {
  //   const url = `${this.apiUrl}/tercero`;
  //   const params = new HttpParams()
  //   .set('nit', nit)

  //   return this.http.get<Tercero>(url, { params })
  // }


  // public checkIdentity(body: { captchaToken: string,  numeroIdentificacion: string  }): Observable<Tercero> {
  //   const url = `${this.apiUrl}/api/public/tercero/identity-document`;
  //   console.log(body)

  //   return this.http.post<Tercero>(url, body)
  // }

  // public resendOtp(body: { captchaToken: string,  numeroIdentificacion: string  }) {
  //   const url = `${this.apiUrl}/api/public/tercero/resend-otp`;
  //   console.log(body)

  //   return this.http.post<Tercero>(url, body)
  // }


  // public validarOtp(body: { otp: string,  numeroIdentificacion: string  }): Observable<Tercero> {
  //   const url = `${this.apiUrl}/api/public/tercero/validar-otp`;
  //   console.log(body)

  //   return this.http.post<Tercero>(url, body)
  // }




}
