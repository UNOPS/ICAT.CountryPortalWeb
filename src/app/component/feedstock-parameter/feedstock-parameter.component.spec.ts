import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedstockParameterComponent } from './feedstock-parameter.component';

describe('FeedstockParameterComponent', () => {
  let component: FeedstockParameterComponent;
  let fixture: ComponentFixture<FeedstockParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedstockParameterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedstockParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
