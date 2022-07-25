import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacResultComponent } from './mac-result.component';

describe('MacResultComponent', () => {
  let component: MacResultComponent;
  let fixture: ComponentFixture<MacResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MacResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
