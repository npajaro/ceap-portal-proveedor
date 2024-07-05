import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: '**', redirectTo: 'dashboard'}
];
