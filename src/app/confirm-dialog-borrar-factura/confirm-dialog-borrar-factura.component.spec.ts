import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogBorrarFacturaComponent } from './confirm-dialog-borrar-factura.component';

describe('ConfirmDialogBorrarFacturaComponent', () => {
  let component: ConfirmDialogBorrarFacturaComponent;
  let fixture: ComponentFixture<ConfirmDialogBorrarFacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmDialogBorrarFacturaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogBorrarFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
