/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { GridService } from './grid.service';

describe('Service: Grid', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GridService],
        });
    });

    it('should ...', inject([GridService], (service: GridService) => {
        expect(service).toBeTruthy();
    }));
});
