import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposeProjectListComponent } from './propose-project-list.component';

describe('ProposeProjectListComponent', () => {
  let component: ProposeProjectListComponent;
  let fixture: ComponentFixture<ProposeProjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposeProjectListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposeProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
