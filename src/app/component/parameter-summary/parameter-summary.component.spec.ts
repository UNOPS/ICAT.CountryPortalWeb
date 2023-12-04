import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterSummaryComponent } from './parameter-summary.component';

describe('ParameterSummaryComponent', () => {
  let component: ParameterSummaryComponent;
  let fixture: ComponentFixture<ParameterSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParameterSummaryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
