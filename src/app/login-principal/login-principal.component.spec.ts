import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPrincipalComponent } from './login-principal.component';

describe('LoginPrincipalComponent', () => {
  let component: LoginPrincipalComponent;
  let fixture: ComponentFixture<LoginPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginPrincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
