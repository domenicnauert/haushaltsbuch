import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RuecklagenGesamtComponent } from './ruecklagen-gesamt.component';

describe('RuecklagenGesamtComponent', () => {
  let component: RuecklagenGesamtComponent;
  let fixture: ComponentFixture<RuecklagenGesamtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RuecklagenGesamtComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuecklagenGesamtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
