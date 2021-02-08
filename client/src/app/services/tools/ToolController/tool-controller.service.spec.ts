import { TestBed } from '@angular/core/testing';
import { PencilService } from '../ToolServices/pencil-service';
import { ToolControllerService } from './tool-controller.service';
// tslint:disable:no-any
fdescribe('ToolControllerService', () => {
    let service: ToolControllerService;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;

    beforeEach(() => {
        pencilServiceSpy = jasmine.createSpyObj('PencilService', {}, { color: 'test' });
        TestBed.configureTestingModule({
            providers: [{ provide: PencilService, useValue: pencilServiceSpy }],
        });
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolControllerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('it should set the right tool', () => {
        service.setTool();

        expect(service.currentTool).toEqual(pencilServiceSpy);
    });
});
