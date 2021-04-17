import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
import { CanvasInformation } from '@common/communication/canvas-information';
import { DrawingService } from './drawing.service';

describe('DrawingService', () => {
    let service: DrawingService;
    let canvasTestHelper: CanvasTestHelper;
    let fillRectSpy: jasmine.Spy;
    let canvasNotEmptySpy: jasmine.Spy;
    let setSizeSpy: jasmine.Spy;
    let clearCanvasSpy: jasmine.Spy;
    let resizePointSpy: jasmine.SpyObj<ResizePoint>;
    let confirmSpy: jasmine.Spy;
    beforeEach(() => {
        resizePointSpy = jasmine.createSpyObj(ResizePoint, ['resetControlPoints']);
        service = new DrawingService(resizePointSpy);
        TestBed.configureTestingModule({
            providers: [DrawingService, { provide: ResizePoint, useValue: resizePointSpy }],
        });
        service = TestBed.inject(DrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.canvas = canvasTestHelper.canvas;
        service.previewCanvas = canvasTestHelper.canvas;
        service.gridCanvas = canvasTestHelper.canvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        service.gridCtx = canvasTestHelper.selectionCanvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initializeCanvas should set canvasSize to 250 by 250 if drawing vue is inferior to 970 by 500 (500+470)', () => {
        const width = 700;
        const height = 500;

        global.innerWidth = width;
        global.innerHeight = height;
        const expectedResult = 250;
        const expectedVect = { x: expectedResult, y: expectedResult };
        expect(service.initializeCanvas()).toEqual(expectedVect);
    });
    it('should set canvasSize to (width-sidebar)/2 by height/2 if drawing vue width is greater than 970 and height is greater than 500', () => {
        const width = 1470;
        const height = 800;
        global.innerWidth = width;
        global.innerHeight = height;
        const expectedResultX = 500;
        const expectedResultY = 400;
        const expectedVect = { x: expectedResultX, y: expectedResultY };
        expect(service.initializeCanvas()).toEqual(expectedVect);
    });
    it('initializeCanvas should set canvasSize to 250 by height/2 if drawing vue width is lesser than 970 and height is greater than 500', () => {
        const width = 800;
        const height = 600;
        global.innerWidth = width;
        global.innerHeight = height;
        const expectedResultX = 250;
        const expectedResultY = 300;
        const expectedVect = { x: expectedResultX, y: expectedResultY };
        expect(service.initializeCanvas()).toEqual(expectedVect);
    });
    it('should set canvasSize to (width-sidebar)/2 by 250 if drawing vue width is greater then 970 and height is lesser then 500', () => {
        const width = 1000;
        const height = 400;
        global.innerWidth = width;
        global.innerHeight = height;
        const expectedResultX = 265;
        const expectedResultY = 250;
        const expectedVect = { x: expectedResultX, y: expectedResultY };
        expect(service.initializeCanvas()).toEqual(expectedVect);
    });
    it('initializeCanvas should set controlSize to same value as canvasSize', () => {
        const width = 1470;
        const height = 800;
        global.innerWidth = width;
        global.innerHeight = height;
        const expectedResultX = 500;
        const expectedResultY = 400;
        service.initializeCanvas();
        expect(service.controlSize.x).toEqual(expectedResultX);
        expect(service.controlSize.y).toEqual(expectedResultY);
    });
    it('initializeCanvas should work the same way if a vec is passed in paramaters', () => {
        const width = 1470;
        const height = 800;
        const vec: Vec2 = { x: 0, y: 0 };

        global.innerWidth = width;
        global.innerHeight = height;
        const expectedResultX = 500;
        const expectedResultY = 400;
        service.initializeCanvas(vec);
        expect(vec.x).toEqual(expectedResultX);
        expect(vec.y).toEqual(expectedResultY);
    });

    it('should clear the whole canvas', () => {
        service.clearCanvas(service.baseCtx);
        const pixelBuffer = new Uint32Array(service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height).data.buffer);
        const hasColoredPixels = pixelBuffer.some((color) => color !== 0);
        expect(hasColoredPixels).toEqual(false);
    });

    it('should get mouse position', () => {
        const event = { offsetX: 1, offsetY: 0 } as MouseEvent;
        const vec = service.getPositionFromMouse(event);

        expect(vec.x).toEqual(event.offsetX);
        expect(vec.y).toEqual(event.offsetY);
    });
    it('should fill new width', () => {
        const previousSize = { x: 300, y: 400 };
        const newSize = { x: 500, y: 400 };
        fillRectSpy = spyOn(service.baseCtx, 'fillRect');
        service.fillNewSpace(previousSize, newSize);
        expect(fillRectSpy).toHaveBeenCalledWith(previousSize.x, 0, newSize.x, previousSize.y);
    });
    it('fillNewSpace should fill new height', () => {
        const previousSize = { x: 300, y: 400 };
        const newSize = { x: 300, y: 600 };
        fillRectSpy = spyOn(service.baseCtx, 'fillRect');
        service.fillNewSpace(previousSize, newSize);
        expect(fillRectSpy).toHaveBeenCalledWith(0, previousSize.y, newSize.x, newSize.y);
    });
    it('fillNewSpace should not fill if new size is smaller than previous size', () => {
        const previousSize = { x: 500, y: 400 };
        const newSize = { x: 300, y: 300 };
        fillRectSpy = spyOn(service.baseCtx, 'fillRect');
        service.fillNewSpace(previousSize, newSize);
        expect(fillRectSpy).not.toHaveBeenCalled();
    });
    it('fillNewSpace should fill new height and width', () => {
        const previousSize = { x: 500, y: 400 };
        const newSize = { x: 700, y: 700 };
        fillRectSpy = spyOn(service.baseCtx, 'fillRect');
        service.fillNewSpace(previousSize, newSize);
        expect(fillRectSpy).toHaveBeenCalledWith(previousSize.x, 0, newSize.x, previousSize.y);
        expect(fillRectSpy).toHaveBeenCalledWith(0, previousSize.y, newSize.x, newSize.y);
    });
    // Problème de test
    it('should create a new canvas if the canvas is not empty and the user confirms', () => {
        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
        // juste pour voir s'il ya un changement
        const vec: Vec2 = { x: 1, y: 1 };
        canvasNotEmptySpy = spyOn(service, 'canvasNotEmpty').and.returnValue(true);
        clearCanvasSpy = spyOn(service, 'clearCanvas');
        setSizeSpy = spyOn(service, 'initializeCanvas').and.returnValue(vec);
        fillRectSpy = spyOn(service.baseCtx, 'fillRect');
        service.newCanvas();

        expect(fillRectSpy).toHaveBeenCalled();
        expect(setSizeSpy).toHaveBeenCalled();
        expect(canvasNotEmptySpy).toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalled();
        expect(clearCanvasSpy).toHaveBeenCalledWith(service.previewCtx);
        expect(clearCanvasSpy).toHaveBeenCalledWith(service.gridCtx);
        expect(resizePointSpy.resetControlPoints).toHaveBeenCalled();
        expect(service.canvas.width).toEqual(vec.x);
        expect(service.canvas.height).toEqual(vec.y);
        expect(service.previewCanvas.width).toEqual(vec.x);
        expect(service.previewCanvas.height).toEqual(vec.y);
    });

    it('should not create a new canvas if the canvas is not empty and the user doesnt confirm', () => {
        confirmSpy = spyOn(window, 'confirm').and.returnValue(false);
        // juste pour voir s'il ya un changement
        const vec: Vec2 = { x: 1, y: 1 };
        canvasNotEmptySpy = spyOn(service, 'canvasNotEmpty').and.returnValue(true);
        clearCanvasSpy = spyOn(service, 'clearCanvas');
        setSizeSpy = spyOn(service, 'initializeCanvas').and.returnValue(vec);
        fillRectSpy = spyOn(service.baseCtx, 'fillRect');
        service.newCanvas();

        expect(fillRectSpy).not.toHaveBeenCalled();
        expect(setSizeSpy).toHaveBeenCalled();
        expect(canvasNotEmptySpy).toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalled();
        expect(clearCanvasSpy).not.toHaveBeenCalledWith(service.previewCtx);
        expect(clearCanvasSpy).not.toHaveBeenCalledWith(service.gridCtx);
        expect(resizePointSpy.resetControlPoints).not.toHaveBeenCalled();
        expect(service.canvas.width).not.toEqual(vec.x);
        expect(service.canvas.height).not.toEqual(vec.y);
        expect(service.previewCanvas.width).not.toEqual(vec.x);
        expect(service.previewCanvas.height).not.toEqual(vec.y);
    });

    it('should  create a new canvas if the canvas is  empty ', () => {
        confirmSpy = spyOn(window, 'confirm');
        // juste pour voir s'il ya un changement
        const vec: Vec2 = { x: 1, y: 1 };
        canvasNotEmptySpy = spyOn(service, 'canvasNotEmpty').and.returnValue(false);
        clearCanvasSpy = spyOn(service, 'clearCanvas');
        setSizeSpy = spyOn(service, 'initializeCanvas').and.returnValue(vec);
        fillRectSpy = spyOn(service.baseCtx, 'fillRect');
        service.newCanvas();

        expect(fillRectSpy).toHaveBeenCalled();
        expect(setSizeSpy).toHaveBeenCalled();
        expect(canvasNotEmptySpy).toHaveBeenCalled();
        expect(confirmSpy).not.toHaveBeenCalled();
        expect(clearCanvasSpy).toHaveBeenCalledWith(service.previewCtx);
        expect(clearCanvasSpy).toHaveBeenCalledWith(service.gridCtx);
        expect(resizePointSpy.resetControlPoints).toHaveBeenCalled();
        expect(service.canvas.width).toEqual(vec.x);
        expect(service.canvas.height).toEqual(vec.y);
        expect(service.previewCanvas.width).toEqual(vec.x);
        expect(service.previewCanvas.height).toEqual(vec.y);
        expect(service.gridCanvas.width).toEqual(vec.x);
        expect(service.gridCanvas.height).toEqual(vec.y);
    });

    it('should load the saved canvas', () => {
        canvasNotEmptySpy = spyOn(service, 'canvasNotEmpty').and.returnValue(false);
        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);

        const reloadSpy = spyOn(service, 'reloadOldCanvas');
        const dispatchSpy = spyOn(window, 'dispatchEvent');
        service.loadOldCanvas({} as CanvasInformation);
        expect(reloadSpy).toHaveBeenCalled();
        expect(dispatchSpy).toHaveBeenCalled();
        expect(canvasNotEmptySpy).toHaveBeenCalled();
        expect(confirmSpy).not.toHaveBeenCalled();
    });

    it('shouldnt load the saved canvas if the user doesnt confirm', () => {
        canvasNotEmptySpy = spyOn(service, 'canvasNotEmpty').and.returnValue(true);
        confirmSpy = spyOn(window, 'confirm').and.returnValue(false);
        const reloadSpy = spyOn(service, 'reloadOldCanvas');
        const dispatchSpy = spyOn(window, 'dispatchEvent');
        service.loadOldCanvas({} as CanvasInformation);
        expect(reloadSpy).not.toHaveBeenCalled();
        expect(dispatchSpy).not.toHaveBeenCalled();
        expect(canvasNotEmptySpy).toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalled();
    });

    it('should charge the image into the canvas', () => {
        const setCanvasSpy = spyOn(service, 'setCanvassSize');
        const ctxSpy = spyOn(service.baseCtx, 'drawImage');
        service.reloadOldCanvas({ width: 1, height: 1, imageData: '' } as CanvasInformation);
        expect(setCanvasSpy).toHaveBeenCalled();
        expect(ctxSpy).toHaveBeenCalled();
    });
    it('reloadOldCanvas should dispatch saveState Event', () => {
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);
        service.reloadOldCanvas({ width: 1, height: 1, imageData: '' } as CanvasInformation);
        expect(spyDispatch).toHaveBeenCalled();
    });

    it('should return true if the canvas is not empty', () => {
        service.baseCtx.fillStyle = 'black';
        service.baseCtx.fillRect(0, 0, 2, 2);
        const image: ImageData = service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height);
        expect(service.canvasNotEmpty(image)).toBeTrue();
    });

    it('should return false if the canvas is empty', () => {
        service.baseCtx.fillStyle = 'white';
        service.baseCtx.fillRect(0, 0, service.canvas.width, service.canvas.height);
        const image: ImageData = service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height);
        expect(service.canvasNotEmpty(image)).not.toBeTrue();
    });

    it('should reset the Canvas', () => {
        fillRectSpy = spyOn(service.baseCtx, 'fillRect');
        clearCanvasSpy = spyOn(service, 'clearCanvas');

        service.resetCanvas({ x: 1, y: 1 } as Vec2);
        expect(fillRectSpy).toHaveBeenCalled();
        expect(clearCanvasSpy).toHaveBeenCalled();
        expect(resizePointSpy.resetControlPoints).toHaveBeenCalled();
    });
});
