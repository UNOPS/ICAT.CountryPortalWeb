import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteParameterComponent } from './route-parameter.component';

describe('RouteParameterComponent', () => {
  let component: RouteParameterComponent;
  let fixture: ComponentFixture<RouteParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
