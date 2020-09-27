import { TestBed } from '@angular/core/testing';

import { MaterialResourcePostingService } from './material-resource-posting.service';

describe('MaterialResourcePostingService', () => {
  let service: MaterialResourcePostingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialResourcePostingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
