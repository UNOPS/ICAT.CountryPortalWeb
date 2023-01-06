import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoardMoreComponent } from './loard-more.component';

describe('LoardMoreComponent', () => {
  let component: LoardMoreComponent;
  let fixture: ComponentFixture<LoardMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoardMoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoardMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
