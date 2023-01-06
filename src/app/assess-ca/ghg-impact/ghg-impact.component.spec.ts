import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhgImpactComponent } from './ghg-impact.component';

describe('GhgImpactComponent', () => {
  let component: GhgImpactComponent;
  let fixture: ComponentFixture<GhgImpactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GhgImpactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GhgImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
