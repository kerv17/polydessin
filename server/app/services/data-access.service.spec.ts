/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { DataAccessService } from './data-access.service';

describe('Service: DataAccess', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataAccessService]
    });
  });

  it('should ...', inject([DataAccessService], (service: DataAccessService) => {
    expect(service).toBeTruthy();
  }));
});
