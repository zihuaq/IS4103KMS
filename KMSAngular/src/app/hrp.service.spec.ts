import { TestBed } from '@angular/core/testing';

import { HrpService } from './hrp.service';

describe('HrpService', () => {
  let service: HrpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
