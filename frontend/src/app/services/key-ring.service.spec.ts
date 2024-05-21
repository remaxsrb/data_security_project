import { TestBed } from '@angular/core/testing';

import { KeyRingService } from './key-ring.service';

describe('KeyRingService', () => {
  let service: KeyRingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyRingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
