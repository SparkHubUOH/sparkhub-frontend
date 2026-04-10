import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home').then((m) => m.Home) },
  { path: 'sign-up', loadComponent: () => import('./pages/sign-up/sign-up').then((m) => m.SignUp) },
  { path: 'log-in', loadComponent: () => import('./pages/log-in/log-in').then((m) => m.LogIn) }
];
