import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarytrackclimateactionsCountryComponent } from './summarytrackclimateactions-country.component';

describe('SummarytrackclimateactionsCountryComponent', () => {
  let component: SummarytrackclimateactionsCountryComponent;
  let fixture: ComponentFixture<SummarytrackclimateactionsCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SummarytrackclimateactionsCountryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      SummarytrackclimateactionsCountryComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
