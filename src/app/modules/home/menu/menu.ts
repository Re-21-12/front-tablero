import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableroService } from '../../../services/tablero-service'; // ajusta ruta si cambiaste carpeta

type TeamId = 'VIKINGOS' | 'JAGUARES';
interface Team { id: TeamId; name: string; logo: string; }

const TEAMS: Team[] = [
  { id: 'VIKINGOS', name: 'VIKINGOS', logo: 'assets/local.png' },
  { id: 'JAGUARES', name: 'JAGUARES', logo: 'assets/visitante.png' },
];

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  constructor(private router: Router, public tablero: TableroService) {}

  teams = TEAMS;
  local = signal<TeamId | null>(null);
  visitante = signal<TeamId | null>(null);

  // Equipos seleccionados calculados en TS 
  localTeam = computed<Team | null>(() => {
    const id = this.local();
    return id ? this.teams.find(t => t.id === id) ?? null : null;
  });

  visitanteTeam = computed<Team | null>(() => {
    const id = this.visitante();
    return id ? this.teams.find(t => t.id === id) ?? null : null;
  });

  canStart = computed(() => {
    const l = this.local(), v = this.visitante();
    return !!(l && v && l !== v);
  });

  pick(side: 'LOCAL' | 'VISITANTE', id: TeamId) {
    if (side === 'LOCAL') {
      if (this.visitante() === id) this.visitante.set(null);
      this.local.set(id);
    } else {
      if (this.local() === id) this.local.set(null);
      this.visitante.set(id);
    }
  }

  swap() {
    const l = this.local(); const v = this.visitante();
    this.local.set(v); this.visitante.set(l);
  }

  start() {
    const l = this.localTeam();      // ← usa los computed
    const v = this.visitanteTeam();
    if (!l || !v) return;

    this.tablero.setEquipos(
      { nombre: l.name, logoUrl: l.logo },
      { nombre: v.name, logoUrl: v.logo }
    );
    this.router.navigateByUrl('/home');
  }
}
