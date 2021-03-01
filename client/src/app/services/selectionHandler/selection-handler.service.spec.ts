import { TestBed } from '@angular/core/testing';

import { SelectionHandlerService } from './selection-handler.service';

describe('SelectionHandlerService', () => {
  let service: SelectionHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectionHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
