import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { IEquipo, ILocalidad } from '../../interfaces/tablero-interface';
import { ApiService } from '../../services/api-service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-equipo',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    JsonPipe
  ],
  templateUrl: './equipo.html',
  styleUrl: './equipo.css'
})
export class Equipo implements OnInit{
  equipoForm: FormGroup;
  equipos: IEquipo[] = [];
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.equipoForm = this.fb.group({
      id_Equipo: [null, Validators.required],
      nombre: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.obtener();
  }

      enviar() {
    if (this.equipoForm.valid) {
      const data: IEquipo = this.equipoForm.value;
      this.apiService.post<IEquipo>('/Equipo', data).subscribe({
        next: (resp) => {

        },
        error: (err) => {
          // Manejar error
        }
      });
    }
  }
    obtener(){
      this.apiService.get<IEquipo[]>('/Equipo').subscribe({
        next: (resp) => {
          this.equipos = [...resp];
          console.log(this.equipos[0]);
        },
        error: (err) => {
          // Manejar error
        }
      });
    }
}
