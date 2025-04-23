import { TestBed } from '@angular/core/testing';

import { FirestoreserviceService } from './firestoreservice.service';

describe('FirestoreserviceService', () => {
  let service: FirestoreserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
