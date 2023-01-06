import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInstitutionComponent } from './view-institution.component';

describe('ViewInstitutionComponent', () => {
  let component: ViewInstitutionComponent;
  let fixture: ComponentFixture<ViewInstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewInstitutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
