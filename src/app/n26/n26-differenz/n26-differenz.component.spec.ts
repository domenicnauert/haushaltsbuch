import { ComponentFixture, TestBed } from '@angular/core/testing';
import { N26DifferenzComponent } from './n26-differenz.component';

describe('VolksbankComponent', () => {
  let component: N26DifferenzComponent;
  let fixture: ComponentFixture<N26DifferenzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [N26DifferenzComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(N26DifferenzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
