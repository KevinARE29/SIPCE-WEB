import { TestBed } from '@angular/core/testing';

import { AcademicCatalogsService } from './academic-catalogs.service';

describe('AcademicCatalogsService', () => {
  let service: AcademicCatalogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcademicCatalogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
