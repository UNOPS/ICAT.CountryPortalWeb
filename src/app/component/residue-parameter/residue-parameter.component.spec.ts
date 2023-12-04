import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueParameterComponent } from './residue-parameter.component';

describe('ResidueParameterComponent', () => {
  let component: ResidueParameterComponent;
  let fixture: ComponentFixture<ResidueParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResidueParameterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidueParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
