import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  { path: 'menu', loadComponent: () => import('./modules/menu/menu').then(m => m.Menu) },
  { path: '**', redirectTo: '/menu' }
];
