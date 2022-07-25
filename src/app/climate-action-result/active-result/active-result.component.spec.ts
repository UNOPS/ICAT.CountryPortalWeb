import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveResultComponent } from './active-result.component';

describe('ActiveResultComponent', () => {
  let component: ActiveResultComponent;
  let fixture: ComponentFixture<ActiveResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
