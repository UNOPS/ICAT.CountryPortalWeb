import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationActionDialogComponent } from './verification-action-dialog.component';

describe('VerificationActionDialogComponent', () => {
  let component: VerificationActionDialogComponent;
  let fixture: ComponentFixture<VerificationActionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificationActionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
