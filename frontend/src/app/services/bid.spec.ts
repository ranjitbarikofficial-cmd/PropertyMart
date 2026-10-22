import { TestBed } from '@angular/core/testing';

import { Bid } from './bid';

describe('Bid', () => {
  let service: Bid;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bid);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
