import { Routes } from '@angular/router';
import { Header } from './layout/header/header';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./layout/header/header').then(m => m.Header) },
];
