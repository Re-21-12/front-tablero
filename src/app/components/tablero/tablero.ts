import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Equipo } from '../equipo/equipo';
import { ResultadoTablero } from '../resultado-tablero/resultado-tablero';
import { TableroService } from '../../services/tablero-service';

@Component({
  selector: 'app-tablero',
  standalone: true,
  imports: [CommonModule, RouterModule, Equipo, ResultadoTablero],
  templateUrl: './tablero.html',
  styleUrl: './tablero.css',
})
export class Tablero {
  constructor(public tablero: TableroService) {}

  @ViewChild('root', { static: true }) root!: ElementRef<HTMLDivElement>;
  isFullscreen = false;

  // Overlay de ayuda
  showHelp = false;
  toggleHelp() { this.showHelp = !this.showHelp; }

  // ---------- Pantalla completa ----------
  toggleFullscreen() {
    const d: any = document;
    const el: any = this.root?.nativeElement ?? document.documentElement;

    if (!d.fullscreenElement && !d.webkitFullscreenElement && !d.msFullscreenElement) {
      (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen)?.call(el);
    } else {
      (d.exitFullscreen || d.webkitExitFullscreen || d.msExitFullscreen)?.call(d);
    }
  }

  @HostListener('document:fullscreenchange')
  @HostListener('document:webkitfullscreenchange')
  @HostListener('document:MSFullscreenChange')
  onFsChange() {
    const d: any = document;
    this.isFullscreen = !!(d.fullscreenElement || d.webkitFullscreenElement || d.msFullscreenElement);
  }

  // ---------- Atajos de teclado ----------
  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    // Evitar capturar si el foco está en inputs/textarea o contentEditable
    const t = e.target as HTMLElement;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;

    switch (e.code) {
      // Pantalla completa
      case 'KeyF': e.preventDefault(); this.toggleFullscreen(); break;

      // Reloj
      case 'Space':
        e.preventDefault();
        this.tablero.partido().enJuego ? this.tablero.pausar() : this.tablero.iniciar();
        break;
      case 'KeyR': this.tablero.reiniciarTiempo(); break;
      case 'KeyN': this.tablero.siguienteCuarto(); break;

      // Posesión
      case 'ArrowLeft':  e.preventDefault(); this.tablero.setPosesion('LOCAL'); break;
      case 'ArrowDown':  e.preventDefault(); this.tablero.setPosesion('NONE'); break;
      case 'ArrowRight': e.preventDefault(); this.tablero.setPosesion('VISITANTE'); break;

      // Ayuda
      case 'KeyH': e.preventDefault(); this.toggleHelp(); break;
      case 'Escape': if (this.showHelp) { e.preventDefault(); this.showHelp = false; } break;

      // Puntos LOCAL (1/2/3)
      case 'Digit1': this.tablero.addPuntos('LOCAL', 1); break;
      case 'Digit2': this.tablero.addPuntos('LOCAL', 2); break;
      case 'Digit3': this.tablero.addPuntos('LOCAL', 3); break;

      // Puntos VISITANTE (8/9/0)
      case 'Digit8': this.tablero.addPuntos('VISITANTE', 1); break;
      case 'Digit9': this.tablero.addPuntos('VISITANTE', 2); break;
      case 'Digit0': this.tablero.addPuntos('VISITANTE', 3); break;
    }
  }

  // Nombre del ganador (para overlay de Game Over)
  get winnerName(): string {
    const loc = this.tablero.local();
    const vis = this.tablero.visitante();
    if (loc.punteoTotal === vis.punteoTotal) return '';
    return loc.punteoTotal > vis.punteoTotal ? loc.nombre : vis.nombre;
  }
}
