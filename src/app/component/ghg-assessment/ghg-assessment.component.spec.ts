import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhgAssessmentComponent } from './ghg-assessment.component';

describe('GhgAssessmentComponent', () => {
  let component: GhgAssessmentComponent;
  let fixture: ComponentFixture<GhgAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GhgAssessmentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GhgAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
