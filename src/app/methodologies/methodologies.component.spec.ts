import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodologiesComponent } from './methodologies.component';

describe('MethodologiesComponent', () => {
  let component: MethodologiesComponent;
  let fixture: ComponentFixture<MethodologiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MethodologiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodologiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
