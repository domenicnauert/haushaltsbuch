import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparquoteComponent } from './sparquote.component';

describe('SparquoteComponent', () => {
  let component: SparquoteComponent;
  let fixture: ComponentFixture<SparquoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SparquoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SparquoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
