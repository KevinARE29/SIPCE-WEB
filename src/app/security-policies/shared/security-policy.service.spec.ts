import { TestBed } from '@angular/core/testing';

import { SecurityPolicyService } from './security-policy.service';

describe('SecurityPolicyService', () => {
  let service: SecurityPolicyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurityPolicyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
