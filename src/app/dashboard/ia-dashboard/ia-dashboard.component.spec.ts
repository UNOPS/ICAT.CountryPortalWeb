import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IaDashboardComponent } from './ia-dashboard.component';

describe('IaDashboardComponent', () => {
  let component: IaDashboardComponent;
  let fixture: ComponentFixture<IaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IaDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
