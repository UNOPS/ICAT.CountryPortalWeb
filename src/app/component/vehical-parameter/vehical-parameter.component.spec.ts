import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicalParameterComponent } from './vehical-parameter.component';

describe('VehicalParameterComponent', () => {
  let component: VehicalParameterComponent;
  let fixture: ComponentFixture<VehicalParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicalParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicalParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
