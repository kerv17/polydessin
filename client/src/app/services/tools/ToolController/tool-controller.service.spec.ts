import { TestBed } from '@angular/core/testing';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EditorService } from '@app/services/editor/editor.service';
import { EllipsisService } from '@app/services/tools/ToolServices/ellipsis-service';
import { LineService } from '@app/services/tools/ToolServices/line-service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { RectangleService } from '@app/services/tools/ToolServices/rectangle-service';
import { ToolControllerService } from './tool-controller.service';
// tslint:disable:no-any
describe('ToolControllerService', () => {
    let service: ToolControllerService;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;
    let drawingService: DrawingService;
    let editorService: EditorService;
    let ellipsisServiceSpy: jasmine.SpyObj<EllipsisService>;
    let rectangleServiceSpy: jasmine.SpyObj<RectangleService>;
    let lineServiceSpy: jasmine.SpyObj<LineService>;

    // let serviceSpy:jasmine.Spy;

    beforeEach(() => {
        pencilServiceSpy = jasmine.createSpyObj('PencilService', {}, { color: 'test' });
        ellipsisServiceSpy = jasmine.createSpyObj('EllipsisService', {}, { color: 'test' });
        rectangleServiceSpy = jasmine.createSpyObj('RectangleService', {}, { color: 'test' });
        lineServiceSpy = jasmine.createSpyObj('LineService', {}, { color: 'test' });
        // serviceSpy = jasmine.createSpy('Toolservice',);
        TestBed.configureTestingModule({
            providers: [
                { provide: PencilService, useValue: pencilServiceSpy },
                { provide: EllipsisService, useValue: ellipsisServiceSpy },
                { provide: RectangleService, useValue: rectangleServiceSpy },
                { provide: LineService, useValue: lineServiceSpy },
            ],
        });
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolControllerService);
        editorService = new EditorService();
        drawingService = new DrawingService(editorService);
        (service as any).currentTool = new RectangleService(drawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('intMap adds values to the toolMap and functionMap', () => {
        service.initMap();
        expect(service.toolMap.size).not.toEqual(0);
        expect(service.functionMap.size).not.toEqual(0);
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

    it('should call shift when shift is down or up', () => {
        const spy: jasmine.Spy<any> = spyOn<any>(service, 'shift');
        const keyEventData = { isTrusted: true, key: Globals.SHIFT_SHORTCUT };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        (service as any).checkKeyEvent(keyDownEvent);
        expect(spy).toHaveBeenCalled();
    });

    it("shift should call current tool's onShift", () => {
        const spy: jasmine.Spy<any> = spyOn<any>(service.currentTool, 'onShift');
        service.shift('keydown');
        expect(spy).toHaveBeenCalledWith(true);
        service.shift('keyup');
        expect(spy).toHaveBeenCalledWith(false);
    });

    it("should call currentTool's onBackspace when pressed", () => {
        const spy = spyOn<any>(service.currentTool, 'onBackspace');
        service.backspace('keydown');
        expect(spy).toHaveBeenCalled();
        expect((service as any).backspaceIsDown).toBeTrue();
    });

    it('should reset backspaceIsDown when event is not keydown', () => {
        (service as any).backspaceIsDown = true;
        const spy = spyOn<any>(service.currentTool, 'onBackspace');
        service.backspace('keyup');
        expect(spy).not.toHaveBeenCalled();
        expect((service as any).backspaceIsDown).toBeFalse();
    });

    it("should not call currentTool's onBackspace when pressed", () => {
        (service as any).backspaceIsDown = true;
        const spy = spyOn<any>(service.currentTool, 'onBackspace');
        service.backspace('keydown');
        expect(spy).not.toHaveBeenCalled();
        expect((service as any).backspaceIsDown).toBeTrue();
    });

    it("should call currentTool's onEscape when pressed", () => {
        const spy = spyOn<any>(service.currentTool, 'onEscape');
        service.escape('keydown');
        expect(spy).toHaveBeenCalled();
        expect((service as any).escapeIsDown).toBeTrue();
    });

    it('should reset escapeIsDown when event is not keydown', () => {
        (service as any).escapeIsDown = true;
        const spy = spyOn<any>(service.currentTool, 'onEscape');
        service.escape('keyup');
        expect(spy).not.toHaveBeenCalled();
        expect((service as any).escapeIsDown).toBeFalse();
    });

    it("should not call currentTool's onEscape when pressed", () => {
        (service as any).escapeIsDown = true;
        const spy = spyOn<any>(service.currentTool, 'onEscape');
        service.escape('keydown');
        expect(spy).not.toHaveBeenCalled();
        expect((service as any).escapeIsDown).toBeTrue();
    });

    xit('focusing on an input element removes focus', () => {
        const input = new HTMLInputElement(); // Emulates an input zone

        const focusEvent = new FocusEvent('focusin');
        input.dispatchEvent(focusEvent);
        expect((service as any).focused).not.toBeTrue();
        document.dispatchEvent(focusEvent);
        expect((service as any).focused).toBeTrue();
    });

    it('checkKeyEvent should set the right tool', () => {
        let test = true;

        for (const key of (service as any).toolMap.keys()) {
            const keyEventData = { isTrusted: true, key };
            const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
            (service as any).checkKeyEvent(keyDownEvent);
            test = service.currentTool === (service as any).toolMap.get(key);
        }

        service.setTool('c');
        service.setTool('f');

        expect(test).toBeTrue();
        expect(service.currentTool).toEqual((service as any).toolMap.get('c'));
    });

    it('checkKeyEvent should call the right functions', () => {
        const shiftSpy = spyOn<any>(service, 'shift');
        const escapeSpy = spyOn<any>(service, 'escape');
        const backspaceSpy = spyOn<any>(service, 'backspace');

        for (const key of (service as any).functionMap.keys()) {
            const keyEventData = { isTrusted: true, key };
            const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
            (service as any).checkKeyEvent(keyDownEvent);
        }

        expect(shiftSpy).toHaveBeenCalledBefore(escapeSpy);
        expect(escapeSpy).toHaveBeenCalledBefore(backspaceSpy);
        expect(backspaceSpy).toHaveBeenCalled();
    });

    it('checkKeyEvent should not pass the value if out of focus', () => {
        const spy = spyOn<any>(service, 'setTool');
        (service as any).focused = false;
        (service as any).checkKeyEvent(new KeyboardEvent('keydown', { key: Globals.crayonShortcut }));
        expect(spy).not.toHaveBeenCalled();
    });

    it('checkKeyEvent should pass the value if in focus', () => {
        const spy = spyOn<any>(service, 'setTool');
        (service as any).focused = true;
        (service as any).checkKeyEvent(new KeyboardEvent('keydown', { key: Globals.crayonShortcut }));
        expect(spy).toHaveBeenCalled();
    });

    it('checkKeyEvent should do nothing if key is not defined', () => {
        const spyTool = spyOn<any>(service, 'setTool');
        const spyFunction = spyOn<any>(service.functionMap, 'get');
        const keyEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'p' });
        (service as any).checkKeyEvent(keyEvent);
        expect(spyTool).not.toHaveBeenCalled();
        expect(spyFunction).not.toHaveBeenCalled();
    });

    it('setFill, setBorder setFillBorder modify the current tools toolMode', () => {
        service.setFill();
        expect(service.currentTool.toolMode).toBe('fill');
        service.setBorder();
        expect(service.currentTool.toolMode).toBe('border');
        service.setFillBorder();
        expect(service.currentTool.toolMode).toBe('fillBorder');
    });

    it('should return whether the current tools tool mode is point', () => {
        expect(service.getLineMode()).toBeFalse();
        service.currentTool.toolMode = 'point';
        expect(service.getLineMode()).toBeTrue();
    });

    it('resetWidth should set width value of all tools to 1', () => {
        const widthTestValue = 50;
        pencilServiceSpy.width = widthTestValue;
        ellipsisServiceSpy.width = widthTestValue;
        rectangleServiceSpy.width = widthTestValue;
        lineServiceSpy.width = widthTestValue;
        service.resetWidth();
        expect(pencilServiceSpy.width).toEqual(1);
        expect(ellipsisServiceSpy.width).toEqual(1);
        expect(rectangleServiceSpy.width).toEqual(1);
        expect(lineServiceSpy.width).toEqual(1);
    });
});
