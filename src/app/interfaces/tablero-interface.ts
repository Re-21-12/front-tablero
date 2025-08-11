export interface PartidoInterface{
  id?: number;
  nombre: string;
  descripcion:string;
fecha_hora :string
cuartos: CuartoInterface[];
equipos: [EquipoInterface, EquipoInterface];
localidad: LocalidadInterace
}

export interface EquipoInterface {
id?: number;
nombre: string;
punteoTotal:number;
faltasTotales: number;
URL:string;
esLocal:boolean;
}

export interface CuartoInterface {
  id?:number;
  tiempo: number;
  punteo: PunteoInterface[];
  faltas: FaltaInteface[];

}
export interface LocalidadInterace{
  id?:number;
  nombre: string;
}
export interface registroCuartoInterface{
id?:number;
nombreEquipo: string;
cuarto: number;
type: 'FALTA' | 'PUNTEO';
}

export interface FaltaInteface extends registroCuartoInterface{
}
export interface PunteoInterface extends registroCuartoInterface{
}
