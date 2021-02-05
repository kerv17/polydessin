import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from './pencil-service';

// tslint:disable:no-any
describe('PencilService', () => {
    let service: PencilService;
    let mouseEvent: MouseEvent;
    let mouseEventRClick: MouseEvent;
    let mouseEvent2: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

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


        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;

        mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1,
        } as MouseEvent;

        mouseEvent2 = {
            offsetX: 56,
            offsetY: 74,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position ', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should not set mouseDownCoord to correct position ', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
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
        service.onMouseUp(mouseEvent);
        expect(clearPathSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should not clear canvas if mouse click was released inside the canvas limits', () => {
        service.outOfBounds = false;
        service.onMouseDown(mouseEvent2);
        service.onMouseUp(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
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

    it(' onMouseUp should call drawLine if mouse was already down', () => {
        service.onMouseDown(mouseEvent2);
        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
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

    it(' onMouseLeave shoud call drawLine if mouse was down while leaving canvas surface', () => {
        service.mouseDown = true;
        service.onMouseLeave(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseLeave shoud clear path & canvas if mouse was down while leaving canvas surface', () => {
        service.mouseDown = true;
        service.onMouseLeave(mouseEvent);
        expect(clearPathSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
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
        const rectSpy = spyOn(drawServiceSpy.previewCtx,'fillRect');
        drawServiceSpy.previewCtx.lineWidth = 1;
        service.onMouseDown(mouseEvent);
        service['drawPixel'](drawServiceSpy.previewCtx, service['pathData']);
        expect(rectSpy).toHaveBeenCalled();
    });

    it(' drawPixel should not draw a single pixel at the last mouseCoord of the path if the width is not 1 pixel', () => {
        const rectSpy = spyOn(drawServiceSpy.previewCtx,'fillRect');
        drawServiceSpy.previewCtx.lineWidth = 24;
        service.onMouseDown(mouseEvent);
        service['drawPixel'](drawServiceSpy.previewCtx, service['pathData']);
        expect(rectSpy).not.toHaveBeenCalled();
    });

    it(' applyAttributes should set the pencil width to the correct selected value if the value is valid ', () => {
        drawServiceSpy.width = 20;
        service.applyAttributes(drawServiceSpy.previewCtx);
        expect(drawServiceSpy.previewCtx.lineWidth).toEqual(drawServiceSpy.width);
    });

    it(' applyAttributes should not set the pencil width if the selected value is not valid', () => {
        drawServiceSpy.width = -10;
        service.applyAttributes(drawServiceSpy.previewCtx);
        expect(drawServiceSpy.previewCtx.lineWidth).not.toEqual(drawServiceSpy.width);
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
    it(' should change the pixel of the canvas ', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 1, offsetY: 0, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // Premier pixel seulement
        const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[3]).not.toEqual(0); // A
    });
});
