import { TestBed } from '@angular/core/testing';
import * as Globals from '@app/Constants/constants';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { ToolControllerService } from './tool-controller.service';

// tslint:disable:no-any
describe('ToolControllerService', () => {
    let service: ToolControllerService;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;
    // let serviceSpy:jasmine.Spy;

    beforeEach(() => {
        pencilServiceSpy = jasmine.createSpyObj('PencilService', {}, { color: 'test' });
        // serviceSpy = jasmine.createSpy('Toolservice',);
        TestBed.configureTestingModule({
            providers: [{ provide: PencilService, useValue: pencilServiceSpy }],
        });
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolControllerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    xit('should call checkKeyPress() when any key is down', () => {
        const keyEventData = { isTrusted: true, key: Globals.crayonShortcut };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        dispatchEvent(keyDownEvent);
        // expect().toHaveBeenCalled();
    });

    it('it should set the right tool', () => {
        expect(service.currentTool).toEqual(pencilServiceSpy);
    });
});
