import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCierresMesComponent } from './ver-cierres-mes.component';

describe('VerCierresMesComponent', () => {
  let component: VerCierresMesComponent;
  let fixture: ComponentFixture<VerCierresMesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerCierresMesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerCierresMesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
