import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StratumParameterComponent } from './stratum-parameter.component';

describe('StratumParameterComponent', () => {
  let component: StratumParameterComponent;
  let fixture: ComponentFixture<StratumParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StratumParameterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StratumParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
