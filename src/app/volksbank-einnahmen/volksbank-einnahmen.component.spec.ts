import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolksbankEinnahmenComponent } from './volksbank-einnahmen.component';

describe('VolksbankComponent', () => {
  let component: VolksbankEinnahmenComponent;
  let fixture: ComponentFixture<VolksbankEinnahmenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolksbankEinnahmenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VolksbankEinnahmenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
