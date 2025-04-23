import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerFacturasBorradasComponent } from './ver-facturas-borradas.component';

describe('VerFacturasBorradasComponent', () => {
  let component: VerFacturasBorradasComponent;
  let fixture: ComponentFixture<VerFacturasBorradasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerFacturasBorradasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerFacturasBorradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
