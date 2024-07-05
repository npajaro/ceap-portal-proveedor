import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {path: '', redirectTo: 'services', pathMatch: 'full'},
      {
        path: 'services',
        loadComponent: () => import('./pages/services-page/services.component'),
        data: { title: 'Services', icons: 'storage' }
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings-page/settings.component'),
      }
    ]
  }
]
