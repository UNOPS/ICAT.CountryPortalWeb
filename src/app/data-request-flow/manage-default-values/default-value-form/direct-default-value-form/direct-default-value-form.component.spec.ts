import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectDefaultValueFormComponent } from './direct-default-value-form.component';

describe('DirectDefaultValueFormComponent', () => {
  let component: DirectDefaultValueFormComponent;
  let fixture: ComponentFixture<DirectDefaultValueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectDefaultValueFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectDefaultValueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
