import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNdcComponent } from './add-ndc.component';

describe('AddNdcComponent', () => {
  let component: AddNdcComponent;
  let fixture: ComponentFixture<AddNdcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNdcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNdcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
