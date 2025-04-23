import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarFacturasCierreModalComponent } from './mostrar-facturas-cierre-modal.component';

describe('MostrarFacturasCierreModalComponent', () => {
  let component: MostrarFacturasCierreModalComponent;
  let fixture: ComponentFixture<MostrarFacturasCierreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MostrarFacturasCierreModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarFacturasCierreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
