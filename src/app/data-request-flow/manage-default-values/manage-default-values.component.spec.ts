import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDefaultValuesComponent } from './manage-default-values.component';

describe('ManageDefaultValuesComponent', () => {
  let component: ManageDefaultValuesComponent;
  let fixture: ComponentFixture<ManageDefaultValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageDefaultValuesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDefaultValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
