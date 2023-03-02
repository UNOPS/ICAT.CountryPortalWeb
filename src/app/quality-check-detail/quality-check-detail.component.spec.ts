import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityCheckDetailComponent } from './quality-check-detail.component';

describe('QualityCheckDetailComponent', () => {
  let component: QualityCheckDetailComponent;
  let fixture: ComponentFixture<QualityCheckDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QualityCheckDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityCheckDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
