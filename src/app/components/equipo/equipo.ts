import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EquipoInterface } from '../../interfaces/tablero-interface';

@Component({
  selector: 'app-equipo',
  imports: [MatCardModule],
  templateUrl: './equipo.html',
  styleUrl: './equipo.css'
})
export class Equipo {

  equipo = input.required<EquipoInterface>();

}
