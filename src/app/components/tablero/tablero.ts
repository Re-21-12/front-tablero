import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Equipo } from '../equipo/equipo';
import { ResultadoTablero } from '../resultado-tablero/resultado-tablero';
import { TableroService } from '../../services/tablero-service';

@Component({
  selector: 'app-tablero',
  standalone: true,
  imports: [CommonModule, Equipo, ResultadoTablero],
  templateUrl: './tablero.html',
  styleUrl: './tablero.css',
})
export class Tablero {
  constructor(public tablero: TableroService) {}

  @ViewChild('root', { static: true }) root!: ElementRef<HTMLDivElement>;
  isFullscreen = false;

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
    // Evitar capturar si el foco está en inputs/textarea
    const t = e.target as HTMLElement;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;

    // Fullscreen
    if (e.code === 'KeyF') { e.preventDefault(); this.toggleFullscreen(); }

    // Reloj
    if (e.code === 'Space') { e.preventDefault(); this.tablero.partido().enJuego ? this.tablero.pausar() : this.tablero.iniciar(); }
    if (e.code === 'KeyR')  { this.tablero.reiniciarTiempo(); }
    if (e.code === 'KeyN')  { this.tablero.siguienteCuarto(); }

    // Puntos LOCAL (1/2/3)
    if (e.code === 'Digit1') this.tablero.addPuntos('LOCAL', 1);
    if (e.code === 'Digit2') this.tablero.addPuntos('LOCAL', 2);
    if (e.code === 'Digit3') this.tablero.addPuntos('LOCAL', 3);

    // Puntos VISITANTE (8/9/0)
    if (e.code === 'Digit8') this.tablero.addPuntos('VISITANTE', 1);
    if (e.code === 'Digit9') this.tablero.addPuntos('VISITANTE', 2);
    if (e.code === 'Digit0') this.tablero.addPuntos('VISITANTE', 3);
  }

  // Para el overlay: nombre del ganador
  get winnerName(): string {
    const loc = this.tablero.local();
    const vis = this.tablero.visitante();
    if (loc.punteoTotal === vis.punteoTotal) return '';
    return loc.punteoTotal > vis.punteoTotal ? loc.nombre : vis.nombre;
  }
}
