import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from '@guards/is-authenticated.guard';
import { isNotAuthenticatedGuard } from '@guards/is-not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [isAuthenticatedGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
    canActivate: [isNotAuthenticatedGuard]
  },
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: '**', redirectTo: 'dashboard'}
];
