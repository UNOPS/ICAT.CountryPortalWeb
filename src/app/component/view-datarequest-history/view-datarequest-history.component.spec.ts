import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDatarequestHistoryComponent } from './view-datarequest-history.component';

describe('ViewDatarequestHistoryComponent', () => {
  let component: ViewDatarequestHistoryComponent;
  let fixture: ComponentFixture<ViewDatarequestHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDatarequestHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDatarequestHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
