import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoTablero } from './resultado-tablero';

describe('ResultadoTablero', () => {
  let component: ResultadoTablero;
  let fixture: ComponentFixture<ResultadoTablero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoTablero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadoTablero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
