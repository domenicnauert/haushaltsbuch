import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SparkasseAusgabenComponent } from './sparkasse-ausgaben.component';

describe('SparkasseAusgabenComponent', () => {
  let component: SparkasseAusgabenComponent;
  let fixture: ComponentFixture<SparkasseAusgabenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SparkasseAusgabenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SparkasseAusgabenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
