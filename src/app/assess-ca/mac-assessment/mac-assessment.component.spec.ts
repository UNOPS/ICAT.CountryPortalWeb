import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacAssessmentComponent } from './mac-assessment.component';

describe('MacAssessmentComponent', () => {
  let component: MacAssessmentComponent;
  let fixture: ComponentFixture<MacAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MacAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
