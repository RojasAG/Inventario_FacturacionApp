import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerFacturasCierreCajeroComponent } from './ver-facturas-cierre-cajero.component';

describe('VerFacturasCierreCajeroComponent', () => {
  let component: VerFacturasCierreCajeroComponent;
  let fixture: ComponentFixture<VerFacturasCierreCajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerFacturasCierreCajeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerFacturasCierreCajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
