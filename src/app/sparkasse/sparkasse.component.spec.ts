import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SparkasseComponent } from './sparkasse.component';

describe('SparkasseComponent', () => {
  let component: SparkasseComponent;
  let fixture: ComponentFixture<SparkasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SparkasseComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SparkasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
