import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarCajeroComponent } from './agregar-cajero.component';

describe('AgregarCajeroComponent', () => {
  let component: AgregarCajeroComponent;
  let fixture: ComponentFixture<AgregarCajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarCajeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarCajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
