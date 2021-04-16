import { TestBed } from '@angular/core/testing';

import { LassoService } from './lasso.service';

describe('LassoService', () => {
    let service: LassoService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LassoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
