import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCierresCajeroComponent } from './ver-cierres-cajero.component';

describe('VerCierresCajeroComponent', () => {
  let component: VerCierresCajeroComponent;
  let fixture: ComponentFixture<VerCierresCajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerCierresCajeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerCierresCajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
