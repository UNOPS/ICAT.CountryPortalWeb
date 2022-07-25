import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagedatastatusComponent } from './managedatastatus.component';

describe('ManagedatastatusComponent', () => {
  let component: ManagedatastatusComponent;
  let fixture: ComponentFixture<ManagedatastatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagedatastatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagedatastatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
