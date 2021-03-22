import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionMovementService } from '@app/services/SelectionMovement/selection-movement.service';
import { SelectionService } from './selection.service';
// tslint:disable: no-string-literal
// tslint:disable: no-any
describe('SelectionService', () => {
    let service: SelectionService;
    let drawService: DrawingService;
    let selectionMoveService: SelectionMovementService;
    let drawServiceSpy: jasmine.Spy;
    let selectionSpy: jasmine.Spy;
    let canvasTestHelper: CanvasTestHelper;
    let selectionMovementSpy: jasmine.Spy;
    const width = 100;
    const height = 100;
    const canvasWidth = 500;
    const canvasHeight = 500;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionService);
        drawService = TestBed.inject(DrawingService);
        selectionMoveService = TestBed.inject(SelectionMovementService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawService.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawService.previewCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawService.canvas = canvasTestHelper.canvas;
        drawService.canvas.width = canvasWidth;
        drawService.canvas.height = canvasHeight;
        service['pathData'] = [
            { x: 100, y: 100 },
            { x: 200, y: 100 },
            { x: 200, y: 200 },
            { x: 100, y: 200 },
        ];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('EventListener on keydown should do nothing if there is no active selection', () => {
        service.inSelection = false;
        selectionSpy = spyOn<any>(service, 'setKeyMovementDelays');
        const selectionSpy2 = spyOn<any>(service, 'onArrowDown');
        const keyEventData = { isTrusted: true, key: '65' };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        document.dispatchEvent(keyDownEvent);
        expect(selectionSpy).not.toHaveBeenCalled();
        expect(selectionSpy2).not.toHaveBeenCalled();
    });

    it('EventListener on keydown should do nothing if the key pressed is not an arrow', () => {
        service.inSelection = true;
        selectionSpy = spyOn<any>(service, 'setKeyMovementDelays');
        const selectionSpy2 = spyOn<any>(service, 'onArrowDown');
        const keyEventData = { isTrusted: true, key: '65' };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        document.dispatchEvent(keyDownEvent);
        expect(selectionSpy).not.toHaveBeenCalled();
        expect(selectionSpy2).not.toHaveBeenCalled();
    });

    it('EventListener on keydown should call setKeyMovementDelays if the arrowKey pressed while inSelection is repeated', () => {
        service.inSelection = true;
        selectionSpy = spyOn<any>(service, 'setKeyMovementDelays');
        const keyEventData = { isTrusted: true, key: 'ArrowRight', repeat: true };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        document.dispatchEvent(keyDownEvent);
        expect(selectionSpy).toHaveBeenCalled();
    });

    it('EventListener on keydown should call arrowDown if the arrowKey pressed while inSelection is not repeated', () => {
        service.inSelection = true;
        selectionSpy = spyOn<any>(service, 'onArrowDown').and.callThrough();
        const keyEventData = { isTrusted: true, key: 'ArrowDown' };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        document.dispatchEvent(keyDownEvent);
        expect(selectionSpy).toHaveBeenCalled();
    });

    it('EventListener on keyup should do nothing if there is no active selection', () => {
        service.inSelection = false;
        selectionMovementSpy = spyOn<any>(selectionMoveService, 'onArrowKeyUp');
        const keyEventData = { isTrusted: true, key: '39', repeat: true };
        const keyUpEvent = new KeyboardEvent('keyup', keyEventData);
        document.dispatchEvent(keyUpEvent);
        expect(selectionMovementSpy).not.toHaveBeenCalled();
    });

    it('EventListener on keyup should do nothing if the key up is not an arrow', () => {
        service.inSelection = true;
        selectionMovementSpy = spyOn<any>(selectionMoveService, 'onArrowKeyUp');
        const keyEventData = { isTrusted: true, key: '67', repeat: true };
        const keyUpEvent = new KeyboardEvent('keyup', keyEventData);
        document.dispatchEvent(keyUpEvent);
        expect(selectionMovementSpy).not.toHaveBeenCalled();
    });

    it('EventListener on keyup should set Keydown to false if the arrow key was released while inSelection is true', () => {
        service.inSelection = true;
        selectionMovementSpy = spyOn<any>(selectionMoveService, 'onArrowKeyUp');
        const keyEventData = { isTrusted: true, key: 'ArrowDown', repeat: true };
        const keyUpEvent = new KeyboardEvent('keyup', keyEventData);
        document.dispatchEvent(keyUpEvent);
        expect(selectionMovementSpy).toHaveBeenCalled();
        expect(service['keyDown']).not.toBeTrue();
        expect(service['firstTime']).toBeTrue();
    });

    it('setKeyMovementDelays should call setTimeout if keyDown is false', () => {
        service['keyDown'] = false;
        jasmine.clock().install();
        service['setKeyMovementDelays']();
        jasmine.clock().tick(Globals.TIMEOUT_MS + 1);
        expect(service['keyDown']).toBeTrue();
        jasmine.clock().uninstall();
    });

    it('setKeyMovementDelays should call setInterval if keyDown is true and firstTime is true', () => {
        service['keyDown'] = true;
        service['firstTime'] = true;
        selectionSpy = spyOn<any>(service, 'onArrowDown');
        jasmine.clock().install();
        service['setKeyMovementDelays']();
        jasmine.clock().tick(Globals.INTERVAL_MS + 1);
        expect(service['firstTime']).not.toBeTrue();
        expect(selectionSpy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('setKeyMovementDelays should not call setInterval if keyDown is true and firstTime is false', () => {
        service['keyDown'] = true;
        service['firstTime'] = false;
        selectionSpy = spyOn<any>(service, 'onArrowDown');
        service['setKeyMovementDelays']();
        expect(service['firstTime']).not.toBeTrue();
        expect(selectionSpy).not.toHaveBeenCalled();
    });

    it('onArrowDown should call moveSelection, clearCanvas, updateCanvasOnMove and putImageData if ImageData is not undefined', () => {
        selectionMovementSpy = spyOn(selectionMoveService, 'moveSelection');
        selectionSpy = spyOn<any>(service, 'updateCanvasOnMove');
        drawServiceSpy = spyOn(drawService, 'clearCanvas');
        service['selectedArea'] = drawService.baseCtx.getImageData(width, height, width, height);
        service['pathData'].push({ x: width, y: height });
        service['onArrowDown']();
        expect(selectionMovementSpy).toHaveBeenCalled();
        expect(selectionSpy).toHaveBeenCalled();
        expect(drawServiceSpy).toHaveBeenCalled();
    });

    it('onArrowDown should not call moveSelection, clearCanvas, updateCanvasOnMove and putImageData if ImageData is undefined', () => {
        selectionMovementSpy = spyOn(selectionMoveService, 'moveSelection');
        selectionSpy = spyOn<any>(service, 'updateCanvasOnMove');
        drawServiceSpy = spyOn(drawService, 'clearCanvas');
        service['pathData'].push({ x: width, y: height });
        service['onArrowDown']();
        expect(selectionMovementSpy).not.toHaveBeenCalled();
        expect(selectionSpy).not.toHaveBeenCalled();
        expect(drawServiceSpy).not.toHaveBeenCalled();
    });
});
