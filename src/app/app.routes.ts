import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'menu', loadComponent: () => import('./modules/menu/menu').then(m => m.Menu) },
  { path: 'tablero', loadComponent: () => import('./modules/tablero/tablero').then(m => m.Tablero) },
  { path: 'home', loadComponent: () => import('./modules/home/home').then(m => m.Home) },
  { path: 'localidad', loadComponent: () => import('./modules/localidad/localidad').then(m => m.Localidad) },
  { path: 'equipo', loadComponent: () => import('./modules/equipo/equipo').then(m => m.Equipo) },
  { path: '**', redirectTo: '/home' }
];
