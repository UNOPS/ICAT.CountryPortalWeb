import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentReportComponent } from './document-report.component';

describe('DocumentReportComponent', () => {
  let component: DocumentReportComponent;
  let fixture: ComponentFixture<DocumentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
