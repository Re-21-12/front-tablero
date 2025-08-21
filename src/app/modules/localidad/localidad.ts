import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api-service';
import { ILocalidad } from '../../interfaces/tablero-interface';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
@Component({
  selector: 'app-localidad',
  imports: [ ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatListModule],
  templateUrl: './localidad.html',
  styleUrl: './localidad.css'
})
export class Localidad {
  localidadForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.localidadForm = this.fb.group({
      id_Localidad: [null, Validators.required],
      nombre: ['', Validators.required]
    });
  }

  enviar() {
    if (this.localidadForm.valid) {
      const data: ILocalidad = this.localidadForm.value;
      this.apiService.post<ILocalidad>('/Localidad', data).subscribe({
        next: (resp) => {
          // Manejar respuesta exitosa
        },
        error: (err) => {
          // Manejar error
        }
      });
    }
  }
}
