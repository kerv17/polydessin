import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { SIDEBAR_WIDTH } from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';
import { PencilService } from './pencil.service';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('PencilService', () => {
    let service: PencilService;
    let mouseEvent: MouseEvent;
    let mouseEventRClick: MouseEvent;
    let mouseEvent2: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let dispatchSpy: jasmine.Spy<any>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy;
    let clearPathSpy: jasmine.Spy;
    let drawPixelSpy: jasmine.Spy;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(PencilService);

        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        clearPathSpy = spyOn<any>(service, 'clearPath').and.callThrough();
        drawPixelSpy = spyOn<any>(service, 'drawPixel').and.callThrough();
        dispatchSpy = spyOn<any>(service, 'dispatchAction');
        // Configuration du spy du service
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service.drawingService.canvas = canvasTestHelper.canvas;
        mouseEvent = {
            // tslint:disable-next-line: no-magic-numbers
            pageX: 25 + SIDEBAR_WIDTH,
            pageY: 25,
            button: 0,
        } as MouseEvent;

        mouseEventRClick = {
            // tslint:disable-next-line: no-magic-numbers
            pageX: 25 + SIDEBAR_WIDTH,
            pageY: 25,
            button: 1,
        } as MouseEvent;

        mouseEvent2 = {
            // tslint:disable-next-line: no-magic-numbers
            pageX: 56 + SIDEBAR_WIDTH,
            pageY: 74,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position if left button was clicked ', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should not set mouseDownCoord to correct position if right button was clicked', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDownCoord).not.toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' mouseDown should clearPath on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(clearPathSpy).toHaveBeenCalled();
    });

    it(' mouseDown should not call clearPath on right click', () => {
        service.onMouseDown(mouseEventRClick);
        expect(clearPathSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should clear canvas & path if mouse click was released out of the canvas limits', () => {
        service.mouseDown = true;
        service.outOfBounds = true;
        (service as any).pathData.push({ x: 0, y: 0 });
        const canvasSize = 10;
        service.drawingService.canvas.width = canvasSize;
        service.drawingService.canvas.height = canvasSize;
        service.onMouseUp(mouseEvent);
        expect(clearPathSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should clear canvas if mouse click was released inside the canvas limits', () => {
        service.outOfBounds = false;

        service.onMouseDown(mouseEvent2);
        service.onMouseUp(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it(' onMouseUp should call drawPixel if mouse was clicked and released at the same position without movement', () => {
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(drawPixelSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawPixel if mouse was not clicked and released at the same position without movement', () => {
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent2);
        expect(drawPixelSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call drawLine and send action event if mouse was already down', () => {
        service.onMouseDown(mouseEvent2);
        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
        expect(dispatchSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawLine if mouse was not already down', () => {
        service.mouseDown = false;

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawLine if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });
    it(' onMouseLeave shoud clear path & canvas if mouse was down while leaving canvas surface', () => {
        service.mouseDown = true;
        service.onMouseLeave(mouseEvent);
        expect(service.outOfBounds).toBeTrue();
    });

    it(' onMouseLeave shoud set outOfbounds to true if mouse was down while leaving canvas surface', () => {
        service.mouseDown = true;
        service.onMouseLeave(mouseEvent);
        expect(service.outOfBounds).toEqual(true);
    });

    it(' onMouseLeave shoud not call drawLine if mouse was not down while leaving canvas surface', () => {
        service.mouseDown = false;
        service.onMouseLeave(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseLeave shoud not clear path & canvas if mouse was not down while leaving canvas surface', () => {
        service.mouseDown = false;
        service.onMouseLeave(mouseEvent);
        expect(clearPathSpy).not.toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it(' onMouseLeave shoud not set outOfbounds to true if mouse was not down while leaving canvas surface', () => {
        service.mouseDown = false;
        service.onMouseLeave(mouseEvent);
        expect(service.outOfBounds).toEqual(false);
    });

    it(' onMouseEnter should set outOfBounds to false if mouse reenters the canvas surface', () => {
        service.onMouseEnter(mouseEvent);
        expect(service.outOfBounds).toEqual(false);
    });

    it(' drawPixel should draw a single pixel at the last mouseCoord of the path if the width is 1 pixel', () => {
        const rectSpy = spyOn(drawServiceSpy.baseCtx, 'fillRect');
        service.width = 1;
        service.onMouseDown(mouseEvent);
        service['drawPixel'](drawServiceSpy.baseCtx, service['pathData']);
        expect(rectSpy).toHaveBeenCalled();
    });

    it(' drawPixel should not draw a single pixel at the last mouseCoord of the path if the width is not 1 pixel', () => {
        const rectSpy = spyOn(drawServiceSpy.baseCtx, 'fillRect');
        const validLinewidth = 24;
        service.width = validLinewidth;
        service.onMouseDown(mouseEvent);
        service['drawPixel'](drawServiceSpy.baseCtx, service['pathData']);
        expect(rectSpy).not.toHaveBeenCalled();
    });

    it(' drawLine should call lineTo if path as points', () => {
        const lineSpy = spyOn(drawServiceSpy.previewCtx, 'lineTo');
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEvent);
        service['drawLine'](drawServiceSpy.previewCtx, service['pathData']);
        expect(lineSpy).toHaveBeenCalled();
    });

    it(' drawLine should not call lineTo if path as no points', () => {
        const lineSpy = spyOn(drawServiceSpy.previewCtx, 'lineTo');
        service['drawLine'](drawServiceSpy.previewCtx, service['pathData']);
        expect(lineSpy).not.toHaveBeenCalled();
    });

    it(' applyAttributes should set the pencil width to the correct selected value if the value is valid ', () => {
        const validPencilWidth = 20;
        service.width = validPencilWidth;
        service.applyAttributes(baseCtxStub);
        expect(baseCtxStub.lineWidth).toEqual(service.width);
    });

    it(' applyAttributes should not set the pencil width if the selected value is not valid', () => {
        const invalidPencilWidth = -10;
        service.width = invalidPencilWidth;
        service.applyAttributes(baseCtxStub);
        expect(baseCtxStub.lineWidth).not.toEqual(service.width);
    });

    it(' applyAttributes should set the pencil color to the correct selected color if it is valid', () => {
        service.color = '#00ff00';
        service.applyAttributes(drawServiceSpy.previewCtx);
        expect(drawServiceSpy.previewCtx.strokeStyle).toEqual(service.color);
    });

    it(' applyAttributes should not set the pencil color if the value selected is not valid', () => {
        service.color = '#0';
        service.applyAttributes(drawServiceSpy.baseCtx);
        expect(drawServiceSpy.baseCtx.strokeStyle).not.toEqual(service.color);
    });

    // Exemple de test d'intégration qui est quand même utile
    it(' should draw on the canvas ', () => {
        // tslint:disable-next-line: no-magic-numbers
        mouseEvent = { pageX: -1 + SIDEBAR_WIDTH, pageY: -1, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { pageX: 1 + SIDEBAR_WIDTH, pageY: 1, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);

        expect(drawLineSpy).toHaveBeenCalledWith(service.drawingService.baseCtx, [{ x: -1, y: -1 }, { x: 1, y: 1 }]);
    });

    it('doAction', () => {
        (service as any).pathData = [{ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 110, y: 110 }];
        const action: DrawAction = (service as any).createAction();
        service.clearPath();
        service.doAction(action);
        expect(drawLineSpy).toHaveBeenCalledWith(action.canvas, action.setting.pathData);
    });

    it('separatePathLists', () => {
        const canvasSize = 10;
        service.drawingService.canvas.width = canvasSize;
        service.drawingService.canvas.height = canvasSize;

        const vec: Vec2[] = [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: -5, y: -2 }, { x: 3, y: 3 }];
        const result = service.separatePathLists(vec);
        const expectedResult = [[{ x: 1, y: 1 }, { x: 2, y: 2 }], [{ x: 3, y: 3 }]];
        expect(result).toEqual(expectedResult);
    });

    it('isPointInRange', () => {
        const canvasSize = 10;
        service.drawingService.canvas.width = canvasSize;
        service.drawingService.canvas.height = canvasSize;
        const points = [{ x: 1, y: 1 }, { x: 15, y: 1 }, { x: 1, y: 15 }, { x: -15, y: 1 }, { x: 1, y: -1 }];
        const expectedResult = [true, false, false, false, false];
        const result: boolean[] = [];
        for (const point of points) {
            result.push(service.isPointInRange(point));
        }
        expect(result).toEqual(expectedResult);
    });

    it('onMouseUp should dispatch saveState Event', () => {
        service.mouseDown = true;
        (service as any).pathData.push({ x: 0, y: 0 });
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);
        service.mouseDown = true;
        service.onMouseUp(mouseEvent);
        expect(spyDispatch).toHaveBeenCalled();
    });
});
