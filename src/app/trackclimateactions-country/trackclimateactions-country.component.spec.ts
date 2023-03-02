import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackclimateactionsCountryComponent } from './trackclimateactions-country.component';

describe('TrackclimateactionsCountryComponent', () => {
  let component: TrackclimateactionsCountryComponent;
  let fixture: ComponentFixture<TrackclimateactionsCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackclimateactionsCountryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackclimateactionsCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
