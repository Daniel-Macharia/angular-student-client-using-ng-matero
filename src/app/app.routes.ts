import { Routes } from '@angular/router';
import { AdminLayout } from '@theme/admin-layout/admin-layout';
import { AuthLayout } from '@theme/auth-layout/auth-layout';
import { Dashboard } from './routes/dashboard/dashboard';
import { Error403 } from './routes/sessions/error-403';
import { Error404 } from './routes/sessions/error-404';
import { Error500 } from './routes/sessions/error-500';
import { NewLogin } from './new-login/new-login';
import { authGuard } from '@core';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: '403', component: Error403 },
      { path: '404', component: Error404 },
      { path: '500', component: Error500 },
    ],
  },
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: 'login', component: NewLogin },
    ],
  },
  { path: '**', redirectTo: 'auth/login' },
];
