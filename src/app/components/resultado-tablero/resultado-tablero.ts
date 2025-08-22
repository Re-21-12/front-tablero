import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableroService } from '../../services/tablero-service';

@Component({
  selector: 'app-resultado-tablero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultado-tablero.html',
  styleUrl: './resultado-tablero.css',
})
export class ResultadoTablero {
  constructor(public tablero: TableroService) {}
}
