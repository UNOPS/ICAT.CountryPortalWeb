import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultValueFormComponent } from './default-value-form.component';

describe('DefaultValueFormComponent', () => {
  let component: DefaultValueFormComponent;
  let fixture: ComponentFixture<DefaultValueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefaultValueFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultValueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
