import { TestBed } from '@angular/core/testing';

import { N26Service } from './n26.service';

describe('N26Service', () => {
  let service: N26Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(N26Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
