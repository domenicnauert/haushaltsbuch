import { ComponentFixture, TestBed } from '@angular/core/testing';
import { N26EinnahmenComponent } from './n26-einnahmen.component';

describe('VolksbankComponent', () => {
  let component: N26EinnahmenComponent;
  let fixture: ComponentFixture<N26EinnahmenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [N26EinnahmenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(N26EinnahmenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
