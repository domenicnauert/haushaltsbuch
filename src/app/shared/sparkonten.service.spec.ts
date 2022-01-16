import { TestBed } from '@angular/core/testing';

import { SparkontenService } from './sparkonten.service';

describe('SparkontenService', () => {
  let service: SparkontenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SparkontenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
