import { Component, input, computed, signal } from '@angular/core';
import { EquipoInterface } from '../../interfaces/tablero-interface';
import { TableroService } from '../../services/tablero-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipo.html',
  styleUrl: './equipo.css',
})
export class Equipo {

  equipo = input.required<EquipoInterface>();
  side   = input<'LOCAL' | 'VISITANTE'>('LOCAL');

  constructor(public tablero: TableroService) {}


  // Oculta el logo si hay error de carga
  readonly showLogo = signal(true);
  hideLogo() { this.showLogo.set(false); }


  readonly sideLabel   = computed(() => this.side() === 'LOCAL' ? 'LOCAL' : 'VISITANTE');
  readonly bonusLabel  = computed(() => this.equipo().bonus ? 'desactivar' : 'activar');
  readonly logoAltText = computed(() => `logo ${this.equipo().nombre}`);
}
