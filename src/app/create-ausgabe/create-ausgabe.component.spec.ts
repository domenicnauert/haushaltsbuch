import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAusgabeComponent } from './create-ausgabe.component';

describe('CreateAusgabeComponent', () => {
  let component: CreateAusgabeComponent;
  let fixture: ComponentFixture<CreateAusgabeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAusgabeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAusgabeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
