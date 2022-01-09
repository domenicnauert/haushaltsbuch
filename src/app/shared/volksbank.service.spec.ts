import { TestBed } from '@angular/core/testing';

import { VolksbankService } from './volksbank.service';

describe('VolksbankService', () => {
  let service: VolksbankService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VolksbankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
