import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyApplications } from './property-applications';

describe('PropertyApplications', () => {
  let component: PropertyApplications;
  let fixture: ComponentFixture<PropertyApplications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyApplications],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyApplications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
