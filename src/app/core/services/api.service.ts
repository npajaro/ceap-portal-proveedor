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


  public getTercero(nit: string): Observable<Tercero> {
    const url = `${this.apiUrl}/tercero`;
    const params = new HttpParams()
    .set('nit', nit)

    return this.http.get<Tercero>(url, { params })
  }




}
