import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryNdcComponent } from './country-ndc.component';

describe('CountryNdcComponent', () => {
  let component: CountryNdcComponent;
  let fixture: ComponentFixture<CountryNdcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryNdcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryNdcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
