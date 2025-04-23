import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerFacturaBorradaModalComponent } from './ver-factura-borrada-modal.component';

describe('VerFacturaBorradaModalComponent', () => {
  let component: VerFacturaBorradaModalComponent;
  let fixture: ComponentFixture<VerFacturaBorradaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerFacturaBorradaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerFacturaBorradaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
