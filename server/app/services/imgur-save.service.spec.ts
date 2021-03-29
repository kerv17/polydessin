/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ImgurSaveService } from './imgur-save.service';

describe('Service: ImgurSave', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImgurSaveService]
    });
  });

  it('should ...', inject([ImgurSaveService], (service: ImgurSaveService) => {
    expect(service).toBeTruthy();
  }));
});
