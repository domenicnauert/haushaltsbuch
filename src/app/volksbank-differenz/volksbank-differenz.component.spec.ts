import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolksbankDifferenzComponent } from './volksbank-differenz.component';

describe('VolksbankComponent', () => {
  let component: VolksbankDifferenzComponent;
  let fixture: ComponentFixture<VolksbankDifferenzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolksbankDifferenzComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VolksbankDifferenzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
