import { TestBed } from '@angular/core/testing';

import { SelectionMovementService } from './selection-movement.service';

describe('SelectionMovementService', () => {
  let service: SelectionMovementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectionMovementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
