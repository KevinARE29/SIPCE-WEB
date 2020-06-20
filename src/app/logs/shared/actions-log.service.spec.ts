import { TestBed } from '@angular/core/testing';

import { ActionsLogService } from './actions-log.service';

describe('ActionsLogService', () => {
  let service: ActionsLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionsLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
