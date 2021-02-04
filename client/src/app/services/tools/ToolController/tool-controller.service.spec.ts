import { TestBed } from '@angular/core/testing';

import { ToolControllerService } from './tool-controller.service';

describe('ToolControllerService', () => {
    let service: ToolControllerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolControllerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
