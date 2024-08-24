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
import { Action, Certificados } from '@interfaces/certificados.interfaces';
import { ApiService } from '@services/api.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreSnackbarService } from '@services/core-snackbar.service';
import { ToastId } from '../../../core/interfaces/toast-Id.enum';
import { SpinnerService } from '@services/spinner.service';


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
    MatIconModule
  ],
  templateUrl: './certificado-retencion.component.html',
  styleUrl: './certificado-retencion.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export default class CertificadoRetencionComponent implements OnInit {
  displayedColumns: string[] = ['id', 'tipoCertificado', 'ano', 'periodo', 'actions'];
  dataSource = new MatTableDataSource<Certificados>();
  reporCertificados: Certificados[] = [];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private breakpointObserver = inject(BreakpointObserver);
  private coreSnackbarSv     = inject(CoreSnackbarService);
  private apiSv              = inject(ApiService);
  private spinnerSv          = inject(SpinnerService);
  private fb                 = inject(FormBuilder);

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
  })

  certificados = [
    { name: 'Certificado Anual De Renta', termino: '1,4,5', value: '1,4,5' },
    { name: 'Certificado Anual De ICA', termino: '3', value: '3A' },
    { name: 'Certificado Bimestral De ICA', termino: '3', value: '3B' },
  ];

  years: { name: string, value: string }[] = [];


  ngOnInit(): void {
    this.currentYear()

    this.myForm.valueChanges.subscribe(() => {
      if (this.myForm.valid) {
        const myForm = this.myForm.value;
        this.getConsultCertificados( myForm);
      }
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public getConsultCertificados(myForm: any) {
    this.spinnerSv.show()
    const { tipoCertificado, years } = myForm;
    const [fechaInicial, fechaFinal] = years.split('-');
    this.apiSv.getCertificados({ fechaInicial, fechaFinal, termino: tipoCertificado }).subscribe({
      next: (data) => {
        if (data.length === 0) {
          this.coreSnackbarSv.openSnackbar(
            'No hay certificados para este año',
            'Cerrar',
            ToastId.WARNING,
            {verticalPosition: 'top', horizontalPosition: 'center', duration: 2000}
          )
        }
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.reporCertificados = data;
        this.spinnerSv.hide();
      },
      error: (error) => {
        this.spinnerSv.hide();
        this.reporCertificados = []
        this.coreSnackbarSv.openSnackbar(
          'Error al consultar los certificados',
          'Cerrar',
          ToastId.ERROR,
          {verticalPosition: 'top', horizontalPosition: 'center', duration: 3000}
        )
        console.error('Error al consultar los certificados', error);
      },
      complete: () => {
        console.log('complete')
        this.spinnerSv.hide();
      }
    })

  }

  public onDownload(row: Action[]) {
    this.spinnerSv.show();

    this.apiSv.downloadPdf(row).subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${row[0].Certificado}-${row[0].Nit}-${row[0].Anio}-${row[0].ID_PERIODO}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.spinnerSv.hide();
      },
      error: (error) => {
        this.spinnerSv.hide();
        this.coreSnackbarSv.openSnackbar(
          'Error al descargar el certificado',
          'Cerrar',
          ToastId.ERROR,
          {verticalPosition: 'top', horizontalPosition: 'center', duration: 3000}
        )
        console.error('Error al descargar el certificado', error);
      },
      complete: () => {
        console.log('complete')
        this.spinnerSv.hide();
      }
    })
  }



  public currentYear() {
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


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


 }
