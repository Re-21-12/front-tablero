import { Component, input, Signal, signal } from '@angular/core';
import { EquipoInterface, PartidoInterface } from '../../interfaces/tablero-interface';

@Component({
  selector: 'app-resultado-tablero',
  imports: [],
  templateUrl: './resultado-tablero.html',
  styleUrl: './resultado-tablero.css'
})
export class ResultadoTablero {


  partido = input.required <PartidoInterface> ();
  equipo_local:Signal<EquipoInterface> = signal<EquipoInterface>(this.partido().equipos[0]); 
  equipo_visitante:Signal<EquipoInterface> = signal<EquipoInterface>(this.partido().equipos[1]);
}
