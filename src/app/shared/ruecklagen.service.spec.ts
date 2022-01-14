import { TestBed } from '@angular/core/testing';

import { RuecklagenService } from './ruecklagen.service';

describe('RuecklagenService', () => {
  let service: RuecklagenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RuecklagenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
