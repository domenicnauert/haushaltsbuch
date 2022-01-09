import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VolksbankComponent } from './volksbank.component';

describe('VolksbankComponent', () => {
  let component: VolksbankComponent;
  let fixture: ComponentFixture<VolksbankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VolksbankComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VolksbankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
