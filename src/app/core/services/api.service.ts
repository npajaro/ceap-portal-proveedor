import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Action, Certificados, Parametros } from '@interfaces/certificados.interfaces';
import { Tercero } from '@interfaces/tercero.interface';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})

export class ApiService {

  private http    = inject(HttpClient);
  private apiUrl  = environment.API_URL;


  private getAuthHeaders(fechaInicial: string = '', fechaFinal: string = '', termino: string = '' ): { headers: HttpHeaders; params: HttpParams } {
    const authToken = localStorage.getItem('token') || '';
    const tercero: Tercero   = JSON.parse(localStorage.getItem('tercero') || '{}');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    });

    const params = new HttpParams()
      .set('fechaInicial', fechaInicial)
      .set('fechaFinal', fechaFinal)
      .set('termino', termino)
      .set('id', tercero.id || '')

    return { headers, params };
  }

  public getCertificados(parametros: Parametros): Observable<Certificados[]> {
    const url = `${this.apiUrl}/api/tercero/get-certificados`;

    const { headers, params } = this.getAuthHeaders(parametros.fechaInicial, parametros.fechaFinal, parametros.termino);

    return this.http.get<Certificados[]>(url, { headers, params })
  }

  public downloadPdf(data: Action[]): Observable<Blob> {
    const url = `${this.apiUrl}/api/tercero/generar-pdf`;

    const { headers } = this.getAuthHeaders();

    return this.http.post(url, data, { headers, responseType: 'blob' });
  }




}
