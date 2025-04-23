import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerFacturasAdminComponent } from './ver-facturas-admin.component';

describe('VerFacturasAdminComponent', () => {
  let component: VerFacturasAdminComponent;
  let fixture: ComponentFixture<VerFacturasAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerFacturasAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerFacturasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
