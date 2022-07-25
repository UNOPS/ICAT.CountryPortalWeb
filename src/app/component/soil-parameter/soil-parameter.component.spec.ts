import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoilParameterComponent } from './soil-parameter.component';

describe('SoilParameterComponent', () => {
  let component: SoilParameterComponent;
  let fixture: ComponentFixture<SoilParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoilParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoilParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
