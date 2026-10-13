import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionBids } from './auction-bids';

describe('AuctionBids', () => {
  let component: AuctionBids;
  let fixture: ComponentFixture<AuctionBids>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionBids],
    }).compileComponents();

    fixture = TestBed.createComponent(AuctionBids);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
