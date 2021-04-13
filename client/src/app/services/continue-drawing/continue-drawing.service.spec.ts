/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ContinueDrawingService } from './continue-drawing.service';

xdescribe('Service: ContinueDrawing', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ContinueDrawingService],
        });
    });

    it('should ...', inject([ContinueDrawingService], (service: ContinueDrawingService) => {
        expect(service).toBeTruthy();
    }));
});
