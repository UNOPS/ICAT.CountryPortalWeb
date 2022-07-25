import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimateActionComponent } from './climate-action.component';

describe('ClimateActionComponent', () => {
  let component: ClimateActionComponent;
  let fixture: ComponentFixture<ClimateActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClimateActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClimateActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
