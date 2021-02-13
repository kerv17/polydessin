import { TestBed } from '@angular/core/testing';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EditorService } from '@app/services/editor/editor.service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { ToolControllerService } from './tool-controller.service';

// tslint:disable:no-any
describe('ToolControllerService', () => {
    let service: ToolControllerService;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;

    beforeEach(() => {
        pencilServiceSpy = jasmine.createSpyObj('PencilService', {}, { color: 'test' });
        // serviceSpy = jasmine.createSpy('Toolservice',);
        TestBed.configureTestingModule({
            providers: [{ provide: PencilService, useValue: pencilServiceSpy }],
        });
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolControllerService);
        service.currentTool = new PencilService(new DrawingService(new EditorService()));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call checkKeyPress() when any key is down', () => {
        const spy: jasmine.Spy<any> = spyOn<any>(service, 'checkKeyEvent');
        const keyEventData = { isTrusted: true, key: Globals.crayonShortcut };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        document.dispatchEvent(keyDownEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should call checkKeyPress() when any key is up', () => {
        const spy: jasmine.Spy<any> = spyOn<any>(service, 'checkKeyEvent');
        const keyEventData = { isTrusted: true, key: Globals.crayonShortcut };
        const keyDownEvent = new KeyboardEvent('keyup', keyEventData);
        document.dispatchEvent(keyDownEvent);
        expect(spy).toHaveBeenCalled();
    });

    it("should call current tool's onShift when shift is down or up", () => {
        const spy: jasmine.Spy<any> = spyOn<any>(service, 'shift').and.callFake(() => {
            'hi';
        });
        // const toolSpy: jasmine.Spy<any> = spyOn<any>(service.currentTool, 'onShift');
        const keyEventData = { isTrusted: true, key: Globals.shiftShortcut };
        const keyDownEvent = new KeyboardEvent('keyup', keyEventData);
        document.dispatchEvent(keyDownEvent);
        expect(spy).toHaveBeenCalled();
        // expect(toolSpy).toHaveBeenCalled();
    });

    it('focusing on an input element removes focus', () => {
        const input = document.createElement('INPUT'); // Emulates an input zone
        const focusEvent = new FocusEvent('focusin');
        input.dispatchEvent(focusEvent);
        expect((service as any).focused).toBeTrue();
        document.dispatchEvent(focusEvent);
        expect((service as any).focused).not.toBeTrue();
    });
    // it('it should set the right tool', () => {});
});
