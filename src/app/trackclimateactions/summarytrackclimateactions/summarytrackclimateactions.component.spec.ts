import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarytrackclimateactionsComponent } from './summarytrackclimateactions.component';

describe('SummarytrackclimateactionsComponent', () => {
  let component: SummarytrackclimateactionsComponent;
  let fixture: ComponentFixture<SummarytrackclimateactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SummarytrackclimateactionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarytrackclimateactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
