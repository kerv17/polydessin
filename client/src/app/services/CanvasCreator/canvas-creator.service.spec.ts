import { TestBed } from '@angular/core/testing';

import { CanvasCreatorService } from './canvas-creator.service';

describe('CanvasCreatorService', () => {
  let service: CanvasCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
