import { Injectable, computed, signal, effect } from '@angular/core';
import {
  EquipoInterface,
  PartidoInterface,
  TeamSide,
  Possession,
} from '../interfaces/tablero-interface';

@Injectable({ providedIn: 'root' })
export class TableroService {
  private _tickHandle: any = null;

  // Límite para activar BONUS automáticamente (FIBA/NBA)
  readonly BONUS_LIMIT = 5;

  // Estado principal del partido
  readonly partido = signal<PartidoInterface>(this.createDefaultMatch());

  // Selectores
  readonly local = computed(() => this.partido().equipos[0]);
  readonly visitante = computed(() => this.partido().equipos[1]);
  readonly tiempoFormateado = computed(() =>
    this.formatTime(this.partido().tiempoRestanteSeg)
  );

  // Buzzer visual
  readonly buzzerOn = signal(false);

  constructor() {
    // Auto-pausa y "buzzer" al llegar a 0
    effect(() => {
      const p = this.partido();
      if (p.tiempoRestanteSeg <= 0 && p.enJuego) {
        this.pausar();
        this.flashBuzzer();
      }
    });
  }

  // ---------- Setup ----------
  createDefaultMatch(): PartidoInterface {
    return {
      nombre: 'THE NATIONAL CHAMPIONSHIP',
      descripcion: 'Exhibición',
      fecha_hora: new Date().toISOString(),
      cuartoActual: 1,
      duracionCuartoSeg: 10 * 60, 
      tiempoRestanteSeg: 10 * 60,
      enJuego: false,
      equipos: [
        {
          nombre: 'VIKINGS',
          punteoTotal: 0,
          faltasTotales: 0,
          esLocal: true,
          logoUrl: 'assets/local.png',
          bonus: false,
        },
        {
          nombre: 'WILDCATS',
          punteoTotal: 0,
          faltasTotales: 0,
          esLocal: false,
          logoUrl: 'assets/visitante.png',
          bonus: false,
        },
      ],
      posesion: 'NONE',
    };
  }

  // ---------- Timer ----------
  iniciar() {
    if (this.partido().enJuego) return;
    this.partido.update((v) => ({ ...v, enJuego: true }));
    this.startTicker();
  }

  pausar() {
    if (!this.partido().enJuego) return;
    this.partido.update((v) => ({ ...v, enJuego: false }));
    if (this._tickHandle) {
      clearInterval(this._tickHandle);
      this._tickHandle = null;
    }
  }

  reiniciarTiempo() {
    this.partido.update((v) => ({ ...v, tiempoRestanteSeg: v.duracionCuartoSeg }));
  }

  setDuracion(minutos: number) {
    const total = Math.max(1, Math.floor(minutos)) * 60;
    this.partido.update((v) => ({
      ...v,
      duracionCuartoSeg: total,
      tiempoRestanteSeg: total,
    }));
  }

  private startTicker() {
    if (this._tickHandle) return;
    this._tickHandle = setInterval(() => {
      this.partido.update((v) => ({
        ...v,
        tiempoRestanteSeg: Math.max(0, v.tiempoRestanteSeg - 1),
      }));
    }, 1000);
  }

  private formatTime(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // ---------- Cuartos ----------
  siguienteCuarto() {
    this.partido.update((v) => {
      const next = Math.min(4, v.cuartoActual + 1);

      // Reiniciar faltas y BONUS al cambiar de período
      const equipos: [EquipoInterface, EquipoInterface] = [
        { ...v.equipos[0], faltasTotales: 0, bonus: false },
        { ...v.equipos[1], faltasTotales: 0, bonus: false },
      ];

      return {
        ...v,
        cuartoActual: next,
        tiempoRestanteSeg: v.duracionCuartoSeg,
        enJuego: false,
        equipos,
      };
    });

    if (this._tickHandle) {
      clearInterval(this._tickHandle);
      this._tickHandle = null;
    }
  }

  // ---------- Posesión / Bonus ----------
  setPosesion(valor: Possession) {
    this.partido.update((v) => ({ ...v, posesion: valor }));
  }

  // BONUS manual
  toggleBonus(side: TeamSide) {
    this.partido.update((v) => {
      const equipos = [...v.equipos] as [EquipoInterface, EquipoInterface];
      const idx = side === 'LOCAL' ? 0 : 1;
      equipos[idx] = { ...equipos[idx], bonus: !equipos[idx].bonus };
      return { ...v, equipos };
    });
  }

  // ---------- Puntos / Faltas ----------
  addPuntos(side: TeamSide, puntos: number) {
    this.partido.update((v) => {
      const equipos = [...v.equipos] as [EquipoInterface, EquipoInterface];
      const idx = side === 'LOCAL' ? 0 : 1;
      const nuevo = Math.max(0, (equipos[idx].punteoTotal ?? 0) + puntos);
      equipos[idx] = { ...equipos[idx], punteoTotal: nuevo };
      return { ...v, equipos };
    });
  }

  addFalta(side: TeamSide, delta: number = 1) {
    this.partido.update((v) => {
      const equipos = [...v.equipos] as [EquipoInterface, EquipoInterface];
      const idx = side === 'LOCAL' ? 0 : 1;

      const faltas = Math.max(0, (equipos[idx].faltasTotales ?? 0) + delta);

      equipos[idx] = {
        ...equipos[idx],
        faltasTotales: faltas,
        // BONUS automático al alcanzar el límite
        bonus: faltas >= this.BONUS_LIMIT,
      };

      return { ...v, equipos };
    });
  }

  // ---------- Control general ----------
  resetPartido() {
    this.pausar();
    this.partido.set(this.createDefaultMatch());
  }

  // Buzzer visual simple
  private flashBuzzer() {
    this.buzzerOn.set(true);
    setTimeout(() => this.buzzerOn.set(false), 2000);
  }
}
