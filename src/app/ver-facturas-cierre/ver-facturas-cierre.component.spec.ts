import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerFacturasCierreComponent } from './ver-facturas-cierre.component';

describe('VerFacturasCierreComponent', () => {
  let component: VerFacturasCierreComponent;
  let fixture: ComponentFixture<VerFacturasCierreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerFacturasCierreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerFacturasCierreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
