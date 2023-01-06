import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacAssessmentApprovedComponent } from './mac-assessment-approved.component';

describe('MacAssessmentApprovedComponent', () => {
  let component: MacAssessmentApprovedComponent;
  let fixture: ComponentFixture<MacAssessmentApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacAssessmentApprovedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MacAssessmentApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
