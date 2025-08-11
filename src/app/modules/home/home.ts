import { Component } from '@angular/core';
import { PageLayout } from "../../layouts/page-layout/page-layout";
import { Tablero } from '../../components/tablero/tablero';

@Component({
  selector: 'app-home',
  imports: [Tablero],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
