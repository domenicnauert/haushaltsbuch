import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolksbankAusgabenComponent } from './volksbank-ausgaben.component';

describe('VolksbankComponent', () => {
  let component: VolksbankAusgabenComponent;
  let fixture: ComponentFixture<VolksbankAusgabenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolksbankAusgabenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VolksbankAusgabenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
