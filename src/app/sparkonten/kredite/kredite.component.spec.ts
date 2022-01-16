import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KrediteComponent } from './kredite.component';

describe('KrediteComponent', () => {
  let component: KrediteComponent;
  let fixture: ComponentFixture<KrediteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KrediteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KrediteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
