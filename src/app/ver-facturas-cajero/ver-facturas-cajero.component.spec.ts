import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerFacturasCajeroComponent } from './ver-facturas-cajero.component';

describe('VerFacturasCajeroComponent', () => {
  let component: VerFacturasCajeroComponent;
  let fixture: ComponentFixture<VerFacturasCajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerFacturasCajeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerFacturasCajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
