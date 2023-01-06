import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerPlantParameterComponent } from './power-plant-parameter.component';

describe('PowerPlantParameterComponent', () => {
  let component: PowerPlantParameterComponent;
  let fixture: ComponentFixture<PowerPlantParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerPlantParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerPlantParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
