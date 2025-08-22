export type TeamSide = 'LOCAL' | 'VISITANTE';
export type Possession = 'LOCAL' | 'VISITANTE' | 'NONE';

export interface PartidoInterface {
  id?: number;
  nombre: string;
  descripcion: string;
  fecha_hora: string;
  cuartoActual: number;         // 1..4
  duracionCuartoSeg: number;    // duración por período en segundos
  tiempoRestanteSeg: number;    // tiempo restante del período en segundos
  enJuego: boolean;
  equipos: [EquipoInterface, EquipoInterface];
  posesion: Possession;
}

export interface EquipoInterface {
  id?: number;
  nombre: string;
  punteoTotal: number;
  faltasTotales: number;
  logoUrl?: string;
  esLocal: boolean;
  bonus?: boolean;              // indicador de bonus
  jugadores?: JugadorInterface[];
}

export interface JugadorInterface {
  id?: number;
  nombre: string;
  numero?: number;
  faltas?: number;
  puntos?: number;
}

export interface CuartoInterface {
  id?: number;
  numero: number;               // 1..4
  registros: RegistroCuartoInterface[];
}

export interface RegistroCuartoInterface {
  id?: number;
  nombreEquipo: string;
  cuarto: number;
  tipo: 'FALTA' | 'PUNTEO';
  valor?: number;               // puntos anotados si es PUNTEO
  timestamp: string;
}

export interface FaltaInterface extends RegistroCuartoInterface {}
export interface PunteoInterface extends RegistroCuartoInterface {}

export interface ILocalidad {
  id_Localidad: number;
  nombre: string;
}
export interface IEquipo {
  id_Equipo: number;
  nombre: string;
}
