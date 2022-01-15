import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuecklagenEinzelnComponent } from './ruecklagen-einzeln.component';

describe('RuecklagenEinzelnComponent', () => {
  let component: RuecklagenEinzelnComponent;
  let fixture: ComponentFixture<RuecklagenEinzelnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RuecklagenEinzelnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuecklagenEinzelnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
