import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Localidad } from './localidad';

describe('Localidad', () => {
  let component: Localidad;
  let fixture: ComponentFixture<Localidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Localidad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Localidad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
