import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableroService } from '../../services/tablero-service';
import { ApiService } from '../../services/api-service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgModel, FormsModule } from '@angular/forms';
import { ILocalidad } from '../../interfaces/tablero-interface';

export interface IEquipo {
  id_Equipo: number;
  nombre: string;
  url?: string; // Si tienes logo, si no, quítalo
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // <--- agrega esto
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  private apiService = inject(ApiService);
  equipos = signal<IEquipo[]>([]);
  localidades = signal<ILocalidad[]>([]);
  local = signal<number | null>(null);
  visitante = signal<number | null>(null);
  localidadSeleccionada = signal<number | null>(null);

  constructor(private router: Router, public tablero: TableroService) {}

  ngOnInit(): void {
    this.getEquipos();
    this.getLocalidad();
  }

  getEquipos() {
    this.apiService.get('/Equipo').subscribe((data: any) => {
      this.equipos.set(data);
    });
  }
  getLocalidad() {
    this.apiService.get('/Localidad').subscribe((data: any) => {
      this.localidades.set(data);
    });
  }

  localTeam = computed<IEquipo | null>(() => {
    const id = this.local();
    return id !== null ? this.equipos().find(t => t.id_Equipo === id) ?? null : null;
  });

  visitanteTeam = computed<IEquipo | null>(() => {
    const id = this.visitante();
    return id !== null ? this.equipos().find(t => t.id_Equipo === id) ?? null : null;
  });

  canStart = computed(() => {
    const l = this.local(), v = this.visitante();
    return !!(l && v && l !== v);
  });

  pick(side: 'LOCAL' | 'VISITANTE', id: number) {
    if (side === 'LOCAL') {
      if (this.visitante() === id) this.visitante.set(null);
      this.local.set(id);
    } else {
      if (this.local() === id) this.local.set(null);
      this.visitante.set(id);
    }
  }

  swap() {
    const l = this.local();
    const v = this.visitante();
    this.local.set(v);
    this.visitante.set(l);
  }

  start() {
    const l = this.localTeam();
    const v = this.visitanteTeam();
    if (!l || !v) return;

    this.tablero.setEquipos(
      { nombre: l.nombre, logoUrl: l.url },
      { nombre: v.nombre, logoUrl: v.url }
    );
    this.router.navigateByUrl('/tablero');
  }

  seleccionarLocalidad(id: number) {
    this.localidadSeleccionada.set(id);
  }
}
