import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelParameterComponent } from './fuel-parameter.component';

describe('FuelParameterComponent', () => {
  let component: FuelParameterComponent;
  let fixture: ComponentFixture<FuelParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
