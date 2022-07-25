import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveClimateActionComponent } from './active-climate-action.component';

describe('ActiveClimateActionComponent', () => {
  let component: ActiveClimateActionComponent;
  let fixture: ComponentFixture<ActiveClimateActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveClimateActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveClimateActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
