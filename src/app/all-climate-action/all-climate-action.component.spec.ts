import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllClimateActionComponent } from './all-climate-action.component';

describe('AllClimateActionComponent', () => {
  let component: AllClimateActionComponent;
  let fixture: ComponentFixture<AllClimateActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllClimateActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllClimateActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
