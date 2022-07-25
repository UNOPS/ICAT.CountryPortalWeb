import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CASADashboardComponent } from './ca-sa-dashboard.component';

describe('CASADashboardComponent', () => {
  let component: CASADashboardComponent;
  let fixture: ComponentFixture<CASADashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CASADashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CASADashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
