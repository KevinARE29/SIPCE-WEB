import { TestBed } from '@angular/core/testing';

import { StudentSociometricTestService } from './student-sociometric-test.service';

describe('StudentSociometricTestService', () => {
  let service: StudentSociometricTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentSociometricTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
