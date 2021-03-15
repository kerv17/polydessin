import { TestBed } from '@angular/core/testing';

import { SelectionBoxService } from './selection-box.service';

describe('SelectionBoxService', () => {
  let service: SelectionBoxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectionBoxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
