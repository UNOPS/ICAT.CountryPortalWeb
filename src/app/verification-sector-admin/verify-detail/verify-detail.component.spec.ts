import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyDetailComponent } from './verify-detail.component';

describe('VerifyDetailComponent', () => {
  let component: VerifyDetailComponent;
  let fixture: ComponentFixture<VerifyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
