import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerAuctions } from './seller-auctions';

describe('SellerAuctions', () => {
  let component: SellerAuctions;
  let fixture: ComponentFixture<SellerAuctions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerAuctions],
    }).compileComponents();

    fixture = TestBed.createComponent(SellerAuctions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
