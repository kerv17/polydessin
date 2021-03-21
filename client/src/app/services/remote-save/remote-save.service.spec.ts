// tslint:disable:no-unused-variable

import { inject, TestBed } from '@angular/core/testing';
import { RemoteSaveService } from './remote-save.service';

describe('Service: RemoteSave', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RemoteSaveService],
        });
    });

    it('should ...', inject([RemoteSaveService], (service: RemoteSaveService) => {
        expect(service).toBeTruthy();
    }));
});
