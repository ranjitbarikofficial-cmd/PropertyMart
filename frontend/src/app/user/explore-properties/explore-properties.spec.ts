import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreProperties } from './explore-properties';

describe('ExploreProperties', () => {
  let component: ExploreProperties;
  let fixture: ComponentFixture<ExploreProperties>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreProperties],
    }).compileComponents();

    fixture = TestBed.createComponent(ExploreProperties);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
