import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Snackbaromponent } from './snackbar.component';

describe('DashboardComponent', () => {
  let component: Snackbaromponent;
  let fixture: ComponentFixture<Snackbaromponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Snackbaromponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Snackbaromponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
