import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacTabComponent } from './mac-tab.component';

describe('MacTabComponent', () => {
  let component: MacTabComponent;
  let fixture: ComponentFixture<MacTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MacTabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MacTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
