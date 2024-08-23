import { computed, inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStatus } from '@interfaces/auth.interfaces';
import { AuthService } from '@services/auth.service';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authSv     = inject(AuthService);
  const router     = inject(Router);
  const currentUrl = state.url;

  const authStatus  = computed(() => authSv.authStatus());
  const token       = localStorage.getItem('token');

  if (token || authStatus() === AuthStatus.authenticated) {
    const urlSaved = localStorage.getItem('url');
    router.navigateByUrl(urlSaved?.toString() || 'dashboard');
    return false;
  } else {
    return true;
  }


};
