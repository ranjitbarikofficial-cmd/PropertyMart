import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerSettings } from './seller-settings';

describe('SellerSettings', () => {
  let component: SellerSettings;
  let fixture: ComponentFixture<SellerSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(SellerSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
