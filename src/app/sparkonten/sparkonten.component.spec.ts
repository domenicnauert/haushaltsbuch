import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparkontenComponent } from './sparkonten.component';

describe('SparkontenComponent', () => {
  let component: SparkontenComponent;
  let fixture: ComponentFixture<SparkontenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SparkontenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SparkontenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
