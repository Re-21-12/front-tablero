import { Component, input } from '@angular/core';
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
  side = input<'LOCAL' | 'VISITANTE'>('LOCAL');

  constructor(public tablero: TableroService) {}
}
