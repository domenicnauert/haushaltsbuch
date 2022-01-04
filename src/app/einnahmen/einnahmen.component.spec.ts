import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EinnahmenComponent } from './einnahmen.component';

describe('EinnahmenComponent', () => {
  let component: EinnahmenComponent;
  let fixture: ComponentFixture<EinnahmenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EinnahmenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EinnahmenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
