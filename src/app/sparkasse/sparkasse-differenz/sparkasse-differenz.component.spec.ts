import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SparkasseDifferenzComponent } from './sparkasse-differenz.component';

describe('SparkasseDifferenzComponent', () => {
  let component: SparkasseDifferenzComponent;
  let fixture: ComponentFixture<SparkasseDifferenzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SparkasseDifferenzComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SparkasseDifferenzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
