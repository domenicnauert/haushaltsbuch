import { TestBed } from '@angular/core/testing';

import { EinnahmenService } from './einnahmen.service';

describe('EinnahmenService', () => {
  let service: EinnahmenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EinnahmenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
