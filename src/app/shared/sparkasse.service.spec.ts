import { TestBed } from '@angular/core/testing';

import { SparkasseService } from './sparkasse.service';

describe('SparkasseService', () => {
  let service: SparkasseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SparkasseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
