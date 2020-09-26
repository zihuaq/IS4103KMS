import { TestBed } from '@angular/core/testing';

import { MaterialResourceAvailableService } from './material-resource-available.service';

describe('MaterialResourceAvailableService', () => {
  let service: MaterialResourceAvailableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialResourceAvailableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
