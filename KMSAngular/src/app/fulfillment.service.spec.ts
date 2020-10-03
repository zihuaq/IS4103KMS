import { TestBed } from '@angular/core/testing';

import { FulfillmentService } from './fulfillment.service';

describe('FulfillmentService', () => {
  let service: FulfillmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FulfillmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
