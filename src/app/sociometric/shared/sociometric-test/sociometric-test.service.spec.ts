import { TestBed } from '@angular/core/testing';

import { SociometricTestService } from './sociometric-test.service';

describe('SociometricTestService', () => {
  let service: SociometricTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SociometricTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
