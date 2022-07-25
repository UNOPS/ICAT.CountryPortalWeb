import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNdcComponent } from './edit-ndc.component';

describe('EditNdcComponent', () => {
  let component: EditNdcComponent;
  let fixture: ComponentFixture<EditNdcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNdcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNdcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
