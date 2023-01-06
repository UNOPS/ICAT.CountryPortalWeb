import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRequestComponent } from './data-request.component';

describe('DataRequestComponent', () => {
  let component: DataRequestComponent;
  let fixture: ComponentFixture<DataRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
