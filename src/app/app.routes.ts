import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  { path: 'menu', loadComponent: () => import('./modules/home/menu/menu').then(m => m.Menu) },
  { path: 'home', loadComponent: () => import('./modules/home/home').then(m => m.Home) },
  { path: '**', redirectTo: '/menu' }
];
