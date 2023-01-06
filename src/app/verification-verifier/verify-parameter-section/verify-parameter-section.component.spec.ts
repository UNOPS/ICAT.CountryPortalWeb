import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyParameterSectionComponent } from './verify-parameter-section.component';

describe('VerifyParameterSectionComponent', () => {
  let component: VerifyParameterSectionComponent;
  let fixture: ComponentFixture<VerifyParameterSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyParameterSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyParameterSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
