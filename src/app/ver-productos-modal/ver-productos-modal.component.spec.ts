import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerProductosModalComponent } from './ver-productos-modal.component';

describe('VerProductosModalComponent', () => {
  let component: VerProductosModalComponent;
  let fixture: ComponentFixture<VerProductosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerProductosModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerProductosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
