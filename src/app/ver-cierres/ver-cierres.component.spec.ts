import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCierresComponent } from './ver-cierres.component';

describe('VerCierresComponent', () => {
  let component: VerCierresComponent;
  let fixture: ComponentFixture<VerCierresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerCierresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerCierresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
