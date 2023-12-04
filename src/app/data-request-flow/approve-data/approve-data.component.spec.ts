import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApproveDataComponent } from './approve-data.component';

describe('ApproveDataComponent', () => {
  let component: ApproveDataComponent;
  let fixture: ComponentFixture<ApproveDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApproveDataComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
