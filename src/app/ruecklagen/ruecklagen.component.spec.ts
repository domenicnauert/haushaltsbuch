import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RuecklagenComponent } from './ruecklagen.component';

describe('RuecklagenComponent', () => {
  let component: RuecklagenComponent;
  let fixture: ComponentFixture<RuecklagenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RuecklagenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuecklagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
