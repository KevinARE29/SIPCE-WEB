import { TestBed } from '@angular/core/testing';

import { ResponsibleService } from './responsible.service';

describe('ResponsibleService', () => {
  let service: ResponsibleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsibleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
