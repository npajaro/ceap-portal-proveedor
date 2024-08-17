import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'services',
        loadComponent: () => import('./pages/services-page/services.component'),
        data: { title: 'Services', icon: 'storage', description: 'Servicios de proveedores' },
        children: [
          { path: 'certificado-retencion', loadComponent: () => import('./pages/certificado-retencion/certificado-retencion.component'),
            data: { title: 'Certificado de Retención', icon: 'receipt_long', description: 'CertificadoButton' } },
          { path: 'pagos-recibidos', loadComponent: () => import('./pages/pagos-recibidos/pagos-recibidos.component'),
            data: { title: 'Pagos Recibidos', icon: 'add', description: 'PagosRecibidosButton' } },
        ]
      },
      { path: 'settings', loadComponent: () => import('./pages/settings-page/settings.component'),
        data: { title: 'Settings', icon: 'settings', description: 'Ajuste de portal' }
      },
      { path: '', redirectTo: 'services', pathMatch: 'full' },
      { path: '**', redirectTo: 'services', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
