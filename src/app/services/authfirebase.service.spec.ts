import { TestBed } from '@angular/core/testing';

import { AuthfirebaseService } from './authfirebase.service';

describe('AuthfirebaseService', () => {
  let service: AuthfirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthfirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
