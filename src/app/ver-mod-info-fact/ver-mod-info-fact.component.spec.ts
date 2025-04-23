import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerModInfoFactComponent } from './ver-mod-info-fact.component';

describe('VerModInfoFactComponent', () => {
  let component: VerModInfoFactComponent;
  let fixture: ComponentFixture<VerModInfoFactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerModInfoFactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerModInfoFactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
