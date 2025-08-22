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

  //  Audio
  readonly soundOn = signal(true);
  private startAudio = new Audio('assets/sounds/start.mp3');
  private endAudio = new Audio('assets/sounds/period-end.mp3');
  private safePlay(a: HTMLAudioElement) {
    if (!this.soundOn()) return;
    try {
      a.currentTime = 0;
      a.play().catch(() => {});
    } catch {}
  }

  // Límite para activar BONUS automáticamente (FIBA/NBA)
  readonly BONUS_LIMIT = 5;

  // Duración de la prórroga (OT)
  readonly duracionProrrogaSeg = 5 * 60;

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
    // volumen del audio
    this.startAudio.preload = 'auto';
    this.startAudio.volume = 0.9;

    // NUEVO: preload del audio de fin de período
    this.endAudio.preload = 'auto';
    this.endAudio.volume = 0.95;

    // Al llegar el tiempo a 0 con el reloj corriendo:
    effect(() => {
      const p = this.partido();
      if (p.tiempoRestanteSeg <= 0 && p.enJuego) {
        const tie = p.equipos[0].punteoTotal === p.equipos[1].punteoTotal;
        const esPeriodoFinalOmas = p.cuartoActual >= 4;

        this.pausar();
        this.flashBuzzer();

        // Sonido de fin de período/fin de juego
        this.safePlay(this.endAudio);

        if (!esPeriodoFinalOmas) {
          // Q1-3: pasar automáticamente al siguiente período
          this.siguienteCuarto();

        } else if (tie) {
          // Empate en 4º u OT => prórroga
          this.iniciarProrroga()
        }
      }
    });
  }

  // ---------- Setup ----------
  createDefaultMatch(): PartidoInterface {
    return {
      nombre: 'CAMPEONATO INTERNACIONAL',
      descripcion: 'Exhibición',
      fecha_hora: new Date().toISOString(),
      cuartoActual: 1,
      duracionCuartoSeg: 10 * 60,
      tiempoRestanteSeg: 10 * 60,
      enJuego: false,
      equipos: [
        {
          nombre: 'VIKINGOS',
          punteoTotal: 0,
          faltasTotales: 0,
          esLocal: true,
          logoUrl: 'assets/local.png',
          bonus: false,
        },
        {
          nombre: 'JAGUARES',
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

  // Permite fijar equipos desde el menú y dejar el partido listo (Período 1)
  setEquipos(
    local: { nombre: string; logoUrl?: string },
    visitante: { nombre: string; logoUrl?: string }
  ) {
    this.pausar(); // por si estaba corriendo
    this.partido.update((v) => {
      const equipos: [EquipoInterface, EquipoInterface] = [
        {
          ...v.equipos[0],
          nombre: local.nombre,
          logoUrl: local.logoUrl ?? v.equipos[0].logoUrl,
          esLocal: true,
          punteoTotal: 0,
          faltasTotales: 0,
          bonus: false,
        },
        {
          ...v.equipos[1],
          nombre: visitante.nombre,
          logoUrl: visitante.logoUrl ?? v.equipos[1].logoUrl,
          esLocal: false,
          punteoTotal: 0,
          faltasTotales: 0,
          bonus: false,
        },
      ];
      return {
        ...v,
        equipos,
        cuartoActual: 1,
        tiempoRestanteSeg: v.duracionCuartoSeg,
        enJuego: false,
        posesion: 'NONE',
      };
    });
  }

  // Helper rápido para tus 2 equipos de prueba
  setEquiposPorNombre(local: 'VIKINGOS' | 'JAGUARES', visitante: 'VIKINGOS' | 'JAGUARES') {
    const logos: Record<'VIKINGOS' | 'JAGUARES', string> = {
      VIKINGOS: 'assets/local.png',
      JAGUARES: 'assets/visitante.png',
    };
    this.setEquipos(
      { nombre: local, logoUrl: logos[local] },
      { nombre: visitante, logoUrl: logos[visitante] }
    );
  }

  // ---------- Timer ----------
  iniciar() {
    if (this.partido().enJuego) return;
    this.partido.update((v) => ({ ...v, enJuego: true }));
    this.startTicker();

    // audio de inicio
    this.safePlay(this.startAudio);
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

  // ---------- OT ----------
  private iniciarProrroga() {
    this.partido.update((v) => {
      const equipos: [EquipoInterface, EquipoInterface] = [
        { ...v.equipos[0], faltasTotales: 0, bonus: false },
        { ...v.equipos[1], faltasTotales: 0, bonus: false },
      ];
      return {
        ...v,
        cuartoActual: v.cuartoActual + 1, // 5=OT1, 6=OT2...
        tiempoRestanteSeg: this.duracionProrrogaSeg,
        enJuego: false,
        equipos,
      };
    });
  }

  // ---------- Cuartos (cambio de periodo ----------
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

  // Reinicia el partido 
  nuevoPartido(preservarEquipos: boolean = true) {
    this.pausar();
    this.buzzerOn.set(false);

    this.partido.update((v) => {
      const equipos = preservarEquipos
        ? ([
            { ...v.equipos[0], punteoTotal: 0, faltasTotales: 0, bonus: false },
            { ...v.equipos[1], punteoTotal: 0, faltasTotales: 0, bonus: false },
          ] as [EquipoInterface, EquipoInterface])
        : this.createDefaultMatch().equipos;

      return {
        ...v,
        equipos,
        cuartoActual: 1,
        tiempoRestanteSeg: v.duracionCuartoSeg,
        enJuego: false,
        posesion: 'NONE',
      };
    });
  }

  // Buzzer visual simple
  private flashBuzzer() {
    this.buzzerOn.set(true);
    setTimeout(() => this.buzzerOn.set(false), 2000);
  }
}