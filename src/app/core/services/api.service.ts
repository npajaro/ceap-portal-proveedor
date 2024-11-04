import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@env/environment';
import { Action, Certificados, Parametros, Periodicity } from '@interfaces/certificados.interfaces';
import { DataProveedor, Proveedor, Tercero } from '@interfaces/tercero.interface';
import { Observable, catchError, map, throwError } from 'rxjs';
import { SpinnerService } from './spinner.service';

@Injectable({providedIn: 'root'})

export class ApiService {

  private http    = inject(HttpClient);
  private apiUrl  = environment.API_URL;
  private spinnerSv = inject(SpinnerService);

  private _dataProveedor = signal<Proveedor | null>(null);

  public dataProveedor$ = computed(() => this._dataProveedor());

  constructor() {
    this.getProveedor().subscribe();
   }


  private getAuthHeaders(fechaInicial: string = '', fechaFinal: string = '', termino: string = '', periodicity: string = '' ): { headers: HttpHeaders; params: HttpParams } {
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
      .set('periodicity', periodicity);

    return { headers, params };
  }

  public getCertificados(parametros: Parametros): Observable<Certificados[]> {
    const url = `${this.apiUrl}/api/tercero/get-certificados`;

    const { headers, params } = this.getAuthHeaders(parametros.fechaInicial, parametros.fechaFinal, parametros.termino);

    return this.http.get<Certificados[]>(url, { headers, params })
  }

  public downloadPdf(data: Action[], periodicity: Periodicity = Periodicity.YEARLY): Observable<Blob> {
    const url = `${this.apiUrl}/api/tercero/generar-pdf`;

     const { params, headers } = this.getAuthHeaders( '', '', '', periodicity);

    return this.http.post(url, data, { headers, responseType: 'blob', params });
  }

  public getProveedor(): Observable<DataProveedor> {
    this.spinnerSv.show('consultar-certificados', 'spinnerLoading');
    const url = `${this.apiUrl}/api/v1/proveedor`;

    const tercero: Tercero   = JSON.parse(localStorage.getItem('tercero') || '{}');

    const { headers } = this.getAuthHeaders();

    const params = new HttpParams()
    .set('nitProveedor', tercero.id || '');

    return this.http.get<DataProveedor>(url, { params, headers })
    .pipe(
      map((res: DataProveedor) => {
        this._dataProveedor.set(res.data);
        this.spinnerSv.hide('consultar-certificados', 'spinnerLoading');
        console.log('dataProveedor', res.data);
        return res;
      }),
      catchError((err: HttpErrorResponse) => {
        this.spinnerSv.hide('consultar-certificados', 'spinnerLoading');
        return throwError(() => err);
      })
    );
  }


  public updateProveedor(data: Proveedor): Observable<Proveedor> {
    const url = `${this.apiUrl}/api/v1/proveedor/update-proveedor`;

    const tercero: Tercero   = JSON.parse(localStorage.getItem('tercero') || '{}');

    const { headers } = this.getAuthHeaders();

    const params = new HttpParams()
    .set('nitProveedor', tercero.id || '');

    return this.http.post<Proveedor>(url, data, { params, headers })

  }




}
