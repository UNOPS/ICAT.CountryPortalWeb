import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposedResultComponent } from './proposed-result.component';

describe('ProposedResultComponent', () => {
  let component: ProposedResultComponent;
  let fixture: ComponentFixture<ProposedResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposedResultComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposedResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
