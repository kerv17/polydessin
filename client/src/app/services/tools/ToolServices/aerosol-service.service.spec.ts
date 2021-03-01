import { TestBed } from '@angular/core/testing';

import { AerosolServiceService } from './aerosol-service.service';

describe('AerosolServiceService', () => {
    let service: AerosolServiceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AerosolServiceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
