import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableroService } from '../../services/tablero-service';
import { Equipo } from '../../components/equipo/equipo';
import { ResultadoTablero } from '../../components/resultado-tablero/resultado-tablero';

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
    }

    // Puntos LOCAL (1/2/3)  — con Shift para restar
    const localMap: Record<string, number> = {
      Digit1: 1, Digit2: 2, Digit3: 3,
      Numpad1: 1, Numpad2: 2, Numpad3: 3,
    };
    if (e.code in localMap) {
      const delta = e.shiftKey ? -localMap[e.code] : localMap[e.code];
      this.tablero.addPuntos('LOCAL', delta);
      return;
    }

    // Puntos VISITANTE (8/9/0)  — con Shift para restar
    const visitMap: Record<string, number> = {
      Digit8: 1, Digit9: 2, Digit0: 3,
      Numpad8: 1, Numpad9: 2, Numpad0: 3,
    };
    if (e.code in visitMap) {
      const delta = e.shiftKey ? -visitMap[e.code] : visitMap[e.code];
      this.tablero.addPuntos('VISITANTE', delta);
      return;
    }

    // Faltas: Local (A/S) — Visitante (K/L)
    switch (e.code) {
      // LOCAL: A (+1), S (-1)
      case 'KeyA': e.preventDefault(); this.tablero.addFalta('LOCAL', 1); return;
      case 'KeyS': e.preventDefault(); this.tablero.addFalta('LOCAL', -1); return;

      // VISITANTE: K (+1), L (-1)
      case 'KeyK': e.preventDefault(); this.tablero.addFalta('VISITANTE', 1); return;
      case 'KeyL': e.preventDefault(); this.tablero.addFalta('VISITANTE', -1); return;
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
