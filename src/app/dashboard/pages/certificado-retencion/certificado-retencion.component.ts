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

export interface Certificado {
  id: string;
  tipoCertificado: string;
  ano: string;
  periodo: string;
  actions: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

/**
 * @title Data table with sorting, pagination, and filtering.
 */

@Component({
  selector: 'app-certificado-retencion',
  standalone: true,
  imports: [
    CommonModule,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CertificadoRetencionComponent implements OnInit {
  displayedColumns: string[] = ['id', 'tipoCertificado', 'ano', 'periodo', 'actions'];
  dataSource = new MatTableDataSource<Certificado>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private breakpointObserver = inject(BreakpointObserver);
  private isMobile$ = this.breakpointObserver
  .observe(Breakpoints.XSmall)
  .pipe(
    map(resul => resul.matches)
  );

  isMobile = toSignal(this.isMobile$, {initialValue: false} )



  reporCertificados: Certificado[] = [
    {
      id: "1",
      tipoCertificado: "Certificado Anual De Renta",
      ano: "2021",
      periodo: "Anual - 2021",
      actions: "Descargar"
    },
    {
      id: "2",
      tipoCertificado: "Certificado Anual De Renta",
      ano: "2020",
      periodo: "Anual - 2020",
      actions: "Descargar"
    },
    {
      id: "3",
      tipoCertificado: "Certificado Bimestral De ICA",
      ano: "2021",
      periodo: "ENE-FEB",
      actions: "Descargar"
    },
    {
      id: "4",
      tipoCertificado: "Certificado Anual De Renta",
      ano: "2019",
      periodo: "Anual - 2019",
      actions: "Descargar"
    },
    {
      id: "5",
      tipoCertificado: "Certificado Anual De Renta",
      ano: "2018",
      periodo: "Anual - 2018",
      actions: "Descargar"
    }
  ];

  certificados = [
    { name: 'Certificado Anual De Renta', termino: '1,4,5', value: '1,4,5' },
    { name: 'Certificado Anual De ICA', termino: '3', value: '3A' },
    { name: 'Certificado Bimestral De ICA', termino: '3', value: '3B' },
  ];




  years: { name: string, value: string }[] = [];

  constructor() {

    // Create 100 users
    // const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(users);
  }

  ngOnInit(): void {
    this.currentYear()
    this.dataSource.data = [
      { id: '1', tipoCertificado: 'Certificado Anual De Renta', ano: '2021', periodo: 'Anual - 2021', actions: 'picture_as_pdf' },
      { id: '2', tipoCertificado: 'Certificado Anual De Renta', ano: '2020', periodo: 'Anual - 2020', actions: 'picture_as_pdf' },
      { id: '3', tipoCertificado: 'Certificado Anual De ICA',   ano: '2021', periodo: 'ENE-FEB', actions: 'picture_as_pdf' },
      { id: '4', tipoCertificado: 'Certificado Anual De Renta', ano: '2019', periodo: 'Anual - 2019', actions: 'picture_as_pdf' },
      { id: '5', tipoCertificado: 'Certificado Anual De Renta', ano: '2018', periodo: 'Anual - 2019', actions: 'picture_as_pdf' },
    ]
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  public onDownload(row: Certificado) {
    console.log('Downloading PDF for:', row);
    // Lógica para descargar el PDF
  }
  public currentYear() {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      this.years.push({
        name: `${year}`,
        value: `${year}0101-${year}1231`
      });
    }
  }

  public onChangeValue(event: any) {
    console.log(event);
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


 }

//  /** Builds and returns a new User. */
// function createNewUser(id: number): Certificado {
//   const name =
//     NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
//     ' ' +
//     NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
//     '.';

//   return {
//     id: id.toString(),
//     name: name,
//     progress: Math.round(Math.random() * 100).toString(),
//     fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
//   };
// }
