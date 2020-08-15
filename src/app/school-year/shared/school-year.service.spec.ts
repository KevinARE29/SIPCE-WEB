import { TestBed } from '@angular/core/testing';

import { SchoolYearService } from './school-year.service';

describe('SchoolYearService', () => {
  let service: SchoolYearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolYearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
