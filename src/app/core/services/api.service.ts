import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Tercero } from '@interfaces/tercero.interface';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})

export class ApiService {

  private http    = inject(HttpClient);

  private apiUrl = environment.API_URL;
  private apiDog = environment.API;
  private conniKey = environment.CONNIKEY;
  private conniToken = environment.CONNITOKEN;

  tercero: any;
  error!: string;

  private getAuthHeaders() {
    const headers = new HttpHeaders({
      'conniKey': environment.CONNIKEY,
      'conniToken': environment.CONNITOKEN
    });

    return { headers };
  }

  //* Información de la empresa *//
  // public getTercero( nit: string ): Observable<Tercero> {
  //   const url = `${this.API_URL}&descripcion=API_TERCERO_BYID&parametros=Nit_tercero%3D${nit}`;
  //   // const url = `${this.API_URL}`;
  //   const { headers }  = this.getAuthHeaders();

  //   const params = new HttpParams()
  //   .set('idCompania', '6771')
  //   .set('descripcion', 'API_TERCERO_BYID')
  //   .set('parametros', `Nit_tercero%3D${nit}`);

  //   return this.http.get<Tercero>(url, { headers });

  //   return this.http.post<Tercero>(`${this.API_URL}/tercero`, { nit }, this.getAuthHeaders());
  // }

  public getTercero(nit_tercero: string): Observable<Tercero> {
    const url = `${this.apiUrl}?idCompania=6771&descripcion=API_TERCERO_BYID&parametros=Nit_tercero%3D${nit_tercero}`;
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Accept': '*/*',
      'x-powered-by': 'ASP.NET',
      'Content-Type': 'application/json',
      'conniKey': this.conniKey,
      'conniToken': this.conniToken
    });

    return this.http.get<Tercero>(url, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }



}
