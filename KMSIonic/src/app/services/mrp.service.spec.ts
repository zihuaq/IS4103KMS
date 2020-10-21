import { TestBed } from '@angular/core/testing';

import { MrpService } from './mrp.service';

describe('MrpService', () => {
  let service: MrpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MrpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
