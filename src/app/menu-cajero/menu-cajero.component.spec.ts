import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCajeroComponent } from './menu-cajero.component';

describe('MenuCajeroComponent', () => {
  let component: MenuCajeroComponent;
  let fixture: ComponentFixture<MenuCajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuCajeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuCajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
