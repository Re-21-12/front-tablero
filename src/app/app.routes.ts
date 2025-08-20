import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  { path: 'menu', loadComponent: () => import('./modules/menu/menu').then(m => m.Menu) },
  { path: 'tablero', loadComponent: () => import('./modules/tablero/tablero').then(m => m.Tablero) },
  { path: '**', redirectTo: '/menu' }
];
