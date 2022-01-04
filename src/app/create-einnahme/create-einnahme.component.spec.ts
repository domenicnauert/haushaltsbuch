import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEinnahmeComponent } from './create-einnahme.component';

describe('CreateEinnahmeComponent', () => {
  let component: CreateEinnahmeComponent;
  let fixture: ComponentFixture<CreateEinnahmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEinnahmeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEinnahmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
