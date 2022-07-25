import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposeProjectComponent } from './propose-project.component';

describe('ProposeProjectComponent', () => {
  let component: ProposeProjectComponent;
  let fixture: ComponentFixture<ProposeProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposeProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposeProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
