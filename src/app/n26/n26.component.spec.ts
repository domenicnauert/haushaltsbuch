import { ComponentFixture, TestBed } from '@angular/core/testing';

import { N26Component } from './n26.component';

describe('N26Component', () => {
  let component: N26Component;
  let fixture: ComponentFixture<N26Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ N26Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(N26Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
