/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServerSaveService } from './server-save.service';

describe('Service: ServerSave', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServerSaveService]
    });
  });

  it('should ...', inject([ServerSaveService], (service: ServerSaveService) => {
    expect(service).toBeTruthy();
  }));
});
