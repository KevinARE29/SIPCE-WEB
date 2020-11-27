import { TestBed } from '@angular/core/testing';

import { DisciplinaryCatalogService } from './disciplinary-catalog.service';

describe('DisciplinaryCatalogService', () => {
  let service: DisciplinaryCatalogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisciplinaryCatalogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
