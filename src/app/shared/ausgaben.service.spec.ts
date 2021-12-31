import { TestBed } from '@angular/core/testing';

import { AusgabenService } from './ausgaben.service';

describe('AusgabenService', () => {
  let service: AusgabenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AusgabenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
