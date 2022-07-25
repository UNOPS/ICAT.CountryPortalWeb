import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackclimateactionsComponent } from './trackclimateactions.component';

describe('TrackclimateactionsComponent', () => {
  let component: TrackclimateactionsComponent;
  let fixture: ComponentFixture<TrackclimateactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackclimateactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackclimateactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
