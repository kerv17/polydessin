/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ContinueDrawingService } from './continue-drawing.service';

describe('Service: ContinueDrawing', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContinueDrawingService]
    });
  });

  it('should ...', inject([ContinueDrawingService], (service: ContinueDrawingService) => {
    expect(service).toBeTruthy();
  }));
});
