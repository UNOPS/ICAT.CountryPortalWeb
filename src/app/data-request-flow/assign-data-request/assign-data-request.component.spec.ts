import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDataRequestComponent } from './assign-data-request.component';

describe('AssignDataRequestComponent', () => {
  let component: AssignDataRequestComponent;
  let fixture: ComponentFixture<AssignDataRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignDataRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignDataRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
