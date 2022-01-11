import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SparkasseEinnahmenComponent } from './sparkasse-einnahmen.component';

describe('SparkasseEinnahmenComponent', () => {
  let component: SparkasseEinnahmenComponent;
  let fixture: ComponentFixture<SparkasseEinnahmenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SparkasseEinnahmenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SparkasseEinnahmenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
