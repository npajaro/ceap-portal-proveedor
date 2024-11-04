import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { map } from 'rxjs';
import { Action, Certificados, Periodicity } from '@interfaces/certificados.interfaces';
import { ApiService } from '@services/api.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreSnackbarService } from '@services/core-snackbar.service';
import { ToastId } from '../../../core/interfaces/toast-Id.enum';
import { SpinnerService } from '@services/spinner.service';
import { AuthService } from '../../../core/services/auth.service';
import { TransformarPeriodoPipe } from "@pipes/transformar-periodo.pipe";

interface CiudadOption {
  name: string;
  value: string;
}


@Component({
  selector: 'app-certificado-retencion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TransformarPeriodoPipe
],
  templateUrl: './certificado-retencion.component.html',
  styleUrl: './certificado-retencion.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export default class CertificadoRetencionComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'tipoCertificado', 'ano', 'ciudad', 'periodo', 'actions'];
  dataSource = new MatTableDataSource<Certificados>();
  reporCertificados: Certificados[] = [];
  ciudades: CiudadOption[] = [];
  filteredData: Certificados[] = [];
  allData: Certificados[] = [];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private breakpointObserver = inject(BreakpointObserver);
  private coreSnackbarSv     = inject(CoreSnackbarService);
  private authSv             = inject(AuthService);
  private apiSv              = inject(ApiService);
  private spinnerSv          = inject(SpinnerService);
  private fb                 = inject(FormBuilder);


  private previousTipoCertificado: string = '';
  private previousYears: string = '';

  private ToastId = ToastId;
  private isMobile$ = this.breakpointObserver
  .observe(Breakpoints.XSmall)
  .pipe(
    map(resul => resul.matches)
  );

  isMobile = toSignal(this.isMobile$, {initialValue: false} )

  public myForm: FormGroup = this.fb.group({
    tipoCertificado:    ['', Validators.required],
    years:              ['', Validators.required],
    ciudad:             ['']
  })

  // Getter para mostrar/ocultar el select de ciudad
  get showCiudadSelect(): boolean {
    return this.myForm.get('tipoCertificado')?.value === '3B' || this.myForm.get('tipoCertificado')?.value === '3A';
  }

  certificados = [
    { name: 'Certificado Anual De Renta', termino: '1,4,5', value: '1,4,5' },
    { name: 'Certificado Anual De IVA', termino: '2', value: '2' },
    { name: 'Certificado Anual De ICA', termino: '3', value: '3A' },
    { name: 'Certificado Bimestral De IVA', termino: '2', value: '2B' },
    { name: 'Certificado Bimestral De ICA', termino: '3', value: '3B' },
  ];

  years: { name: string, value: string }[] = [];


  ngOnInit(): void {
    // Suscripción para resetear ciudad cuando cambia tipoCertificado
    this.myForm.get('tipoCertificado')?.valueChanges.subscribe(tipo => {
      this.currentYear(tipo);
      console.log('tipo', tipo);
      if (tipo !== '3B' || tipo !== '3A') {
        this.myForm.patchValue({ ciudad: '' }, { emitEvent: false });
      }
    });

    // Suscripción a cambios en tipoCertificado y years
    this.myForm.valueChanges.subscribe(() => {
      const tipoCertificado = this.myForm.get('tipoCertificado')?.value;
      const years = this.myForm.get('years')?.value;

      // Si el tipo de certificado cambió desde '3B' o '2B' a otro, restablecer el campo 'years'
      if ((this.previousTipoCertificado === '3B' || this.previousTipoCertificado === '2B') &&
          tipoCertificado !== this.previousTipoCertificado) {
        this.myForm.patchValue({ years: '' }, { emitEvent: false });
        this.previousTipoCertificado = tipoCertificado;
        this.previousYears = '';
        this.dataSource.data = [];
        this.reporCertificados = [];
        return; // Salir de la suscripción hasta que el usuario seleccione una fecha
      }

      // Solo realizar la consulta si cambian tipoCertificado o years y son válidos
      if (this.myForm.get('tipoCertificado')?.valid &&
          this.myForm.get('years')?.valid &&
          (tipoCertificado !== this.previousTipoCertificado ||
          years !== this.previousYears)) {

        this.previousTipoCertificado = tipoCertificado;
        this.previousYears = years;

        this.dataSource.data = [];
        this.reporCertificados = [];
        this.getConsultCertificados(this.myForm.value);
      }
    });

    // Suscripción específica para el cambio de ciudad
    this.myForm.get('ciudad')?.valueChanges.subscribe(ciudad => {
      this.filterDataByCiudad(ciudad);
    });


  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public getConsultCertificados(myForm: any) {
    this.spinnerSv.show('consultar-certificados', 'spinnerLoading');
    const { tipoCertificado, years } = myForm;
    const [fechaInicial, fechaFinal] = years.split('-');

    this.apiSv.getCertificados({ fechaInicial, fechaFinal, termino: tipoCertificado }).subscribe({
      next: (data) => {
        if (data.length === 0) {
          this.showNoDataMessage();
          return;
        }

        // Guardar todos los datos
        this.allData = data;

        // Procesar ciudades solo si es certificado bimestral
        if (tipoCertificado === '3B' || tipoCertificado === '3A') {
          this.processCiudades(data);
        }

        // Actualizar la vista con todos los datos o los filtrados por ciudad
        const ciudadSeleccionada = this.myForm.get('ciudad')?.value;
        if (ciudadSeleccionada && tipoCertificado === '3B' || tipoCertificado === '3A') {
          this.filterDataByCiudad(ciudadSeleccionada);
        } else {
          this.updateDataSource(data);
        }

        this.spinnerSv.hide('consultar-certificados', 'spinnerLoading');
      },
      error: (error) => this.handleError(error),
      complete: () => this.spinnerSv.hide('consultar-certificados', 'spinnerLoading')
    });
  }

  private processCiudades(data: Certificados[]) {
    // Extraer ciudades únicas y ordenarlas
    const uniqueCities = [...new Set(data.map(item => item.ciudad))].sort();
    this.ciudades = uniqueCities.map(ciudad => ({
      name: ciudad,
      value: ciudad
    }));
  }

  private showNoDataMessage() {
    this.coreSnackbarSv.openSnackbar(
      'No hay certificados para este año',
      'Cerrar',
      ToastId.WARNING,
      {verticalPosition: 'top', horizontalPosition: 'center', duration: 2000}
    );
    this.dataSource.data = [];
    this.reporCertificados = [];
  }

  private handleError(error: any) {
    this.spinnerSv.hide('consultar-certificados', 'spinnerLoading');
    this.reporCertificados = [];
    const errorStatus = error?.status;
    const errorMessage = error?.error?.message || 'Error al consultar los certificados';

    if (errorStatus === 401) {
      this.authSv.logout();
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else if (errorMessage.includes('No se encontraron registros, por favor verifique')) {
        this.coreSnackbarSv.openSnackbar(
            'No hay registros para esta fecha',
            'Cerrar',
            ToastId.WARNING,
            { verticalPosition: 'top', horizontalPosition: 'center', duration: 3000 }
        );
        this.dataSource.data = [];
        this.reporCertificados = [];
    } else {
        this.coreSnackbarSv.openSnackbar(
            'Error al consultar los certificados',
            'Cerrar',
            ToastId.ERROR,
            { verticalPosition: 'top', horizontalPosition: 'center', duration: 3000 }
        );
    }
    console.error('Error al consultar los certificados', error);
  }


  private filterDataByCiudad(ciudad: string) {
    if (!ciudad) {
      // Si no hay ciudad seleccionada, mostrar todos los datos
      this.updateDataSource(this.allData);
    } else {
      // Filtrar por ciudad seleccionada de los datos almacenados
      const filteredData = this.allData.filter(item => item.ciudad === ciudad);
      this.updateDataSource(filteredData);
    }
  }

  private updateDataSource(data: Certificados[]) {
    // Ordenar datos por periodo y ciudad
    const sortedData = [...data].sort((a, b) => {
      const periodA = a.periodo || '';
      const periodB = b.periodo || '';
      const ciudadA = a.ciudad  || '';
      const ciudadB = b.ciudad  || '';

      const periodCompare = periodA.localeCompare(periodB);
      if (periodCompare !== 0) return periodCompare;
      return ciudadA.localeCompare(ciudadB);
    });

    this.dataSource.data = sortedData;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.reporCertificados = sortedData;
  }

  public onDownload(row: Action[]) {
    this.spinnerSv.show('consultar-certificados', 'spinnerDownload');

    const tipoCertificado = this.myForm.get('tipoCertificado')?.value;

    const periodicity = tipoCertificado === '2'
      ? Periodicity.YEARLY_IVA
      : tipoCertificado === '2B'
      ? Periodicity.BIMONTHLY_IVA
      : tipoCertificado === '3B'
      ? Periodicity.BIMONTHLY
      : tipoCertificado === '3A'
      ? Periodicity.YEARLY_ICA
      : Periodicity.YEARLY;

    console.log('periodicity', periodicity);

    this.downloadPdf(row, periodicity);
  }


  public downloadPdf(row: Action[], periodicity: Periodicity = Periodicity.YEARLY) {
    this.apiSv.downloadPdf(row, periodicity).subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${row[0].Certificado}-${row[0].Nit}-${row[0].Anio}-${row[0].ID_PERIODO}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.spinnerSv.hide('consultar-certificados', 'spinnerDownload');
      },
      error: (error) => {
        this.spinnerSv.hide('consultar-certificados', 'spinnerDownload');
        this.coreSnackbarSv.openSnackbar(
          'Error al descargar el certificado',
          'Cerrar',
          ToastId.ERROR,
          { verticalPosition: 'top', horizontalPosition: 'center', duration: 3000 }
        );
        console.error('Error al descargar el certificado', error);
      },
      complete: () => {
        console.log('complete')
        this.spinnerSv.hide('consultar-certificados', 'spinnerDownload');
      }
    })
  }


  public currentYear(tipoCertificado: string = '') {

    console.log('tipoCertificado', tipoCertificado);

    if (tipoCertificado === '2B' || tipoCertificado === '3B') {
      this.years = [];

      const today = new Date();
      const currentYears = today.getFullYear();

      const lastAvailableBimester = this.getLastAvailableBimester(today);

      for (let bimester = 1; bimester <= lastAvailableBimester; bimester++) {
        const startMonth = (bimester * 2) - 1;
        const endMonth = bimester * 2;

        const startDate = new Date(currentYears, startMonth - 1, 1);
        const endDate = new Date(currentYears, endMonth, 0); // Último día del mes

        const startDateStr = `${currentYears}${('0' + startMonth).slice(-2)}01`;
        const endDateStr = `${currentYears}${('0' + endMonth).slice(-2)}${('0' + endDate.getDate()).slice(-2)}`;

        this.years.push({
          name: `B${bimester} ${currentYears}`,
          value: `${startDateStr}-${endDateStr}`
        });
      }


      const currentYear = new Date().getFullYear() - 1;
      let minYear = currentYear;

      // Generar rangos individuales de años
      for (let i = 0; i < 5; i++) {
        const year = currentYear - i;
        this.years.push({
          name: `${year}`,
          value: `${year}0101-${year}1231`
        });
        minYear = year; // Actualizar el año mínimo
      }

      // Agregar opción para seleccionar todo el rango de 5 años
      this.years.push({
        name: `Últimos 5 años`,
        value: `${minYear}0101-${currentYear}1231`
      });
    } else {
      this.years = [];

      const currentYear = new Date().getFullYear() - 1; // Restar 1 para excluir el año actual
      let minYear = currentYear;

      // Generar rangos individuales de años
      for (let i = 0; i < 5; i++) {
        const year = currentYear - i;
        this.years.push({
          name: `${year}`,
          value: `${year}0101-${year}1231`
        });
        minYear = year; // Actualizar el año mínimo
      }

      // Agregar opción para seleccionar todo el rango de 5 años
      this.years.push({
        name: `Últimos 5 años`,
        value: `${minYear}0101-${currentYear}1231`
      });
    }

  }

  private getLastAvailableBimester(today: Date): number {
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // Mes actual (1-12)

    // Calcular el bimestre actual
    const currentBimester = Math.ceil(currentMonth / 2);

    let lastAvailableBimester = currentBimester - 1;

    // Fecha límite para considerar el bimestre actual disponible
    const endMonthLimit = (currentBimester * 2) + 1; // Mes siguiente al final del bimestre
    const limitDate = new Date(currentYear, endMonthLimit - 1, 15);

    // Si hoy es igual o posterior al día 15 del mes límite, el bimestre actual está disponible
    if (today >= limitDate) {
      lastAvailableBimester = currentBimester;
    }

    // Asegurar que el número de bimestre no sea negativo
    if (lastAvailableBimester < 1) {
      lastAvailableBimester = 0;
    }

    return lastAvailableBimester;
  }

 }
