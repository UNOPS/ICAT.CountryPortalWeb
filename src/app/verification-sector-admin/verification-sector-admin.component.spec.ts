import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationSectorAdminComponent } from './verification-sector-admin.component';

describe('VerificationSectorAdminComponent', () => {
  let component: VerificationSectorAdminComponent;
  let fixture: ComponentFixture<VerificationSectorAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerificationSectorAdminComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationSectorAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
