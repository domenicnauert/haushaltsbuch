import { ComponentFixture, TestBed } from '@angular/core/testing';
import { N26AusgabenComponent } from './n26-ausgaben.component';

describe('VolksbankComponent', () => {
  let component: N26AusgabenComponent;
  let fixture: ComponentFixture<N26AusgabenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [N26AusgabenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(N26AusgabenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
