import { TestBed } from '@angular/core/testing';
import { PositionService } from './position.service';

describe('AusgabenService', () => {
  let service: PositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
