import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcHistoryComponent } from './qc-history.component';

describe('QcHistoryComponent', () => {
  let component: QcHistoryComponent;
  let fixture: ComponentFixture<QcHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QcHistoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QcHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
