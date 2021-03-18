/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { MetadataService } from './metadata.service';

describe('Service: Metadata', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetadataService]
    });
  });

  it('should ...', inject([MetadataService], (service: MetadataService) => {
    expect(service).toBeTruthy();
  }));
});
