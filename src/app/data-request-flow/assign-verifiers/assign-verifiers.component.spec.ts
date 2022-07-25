import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignVerifiersComponent } from './assign-verifiers.component';

describe('AssignVerifiersComponent', () => {
  let component: AssignVerifiersComponent;
  let fixture: ComponentFixture<AssignVerifiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignVerifiersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignVerifiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
