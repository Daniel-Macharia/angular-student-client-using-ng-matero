import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { CustomAuthService } from 'app/features/custom-auth-service';

export const authGuard = (route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot) => {
  const auth = inject(CustomAuthService);
  const router = inject(Router);

  return auth.check() ? true : router.parseUrl('/auth/login');
};
