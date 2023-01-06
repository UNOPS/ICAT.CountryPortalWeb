import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseConcernComponent } from './raise-concern.component';

describe('RaiseConcernComponent', () => {
  let component: RaiseConcernComponent;
  let fixture: ComponentFixture<RaiseConcernComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaiseConcernComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseConcernComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
