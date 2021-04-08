import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
import { BucketService } from './bucket.service';
// tslint:disable: no-any
describe('BucketService', () => {
    let service: BucketService;
    let drawingService: DrawingService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    const coords = [0, 1, 2];
    beforeEach(() => {
        canvasTestHelper = new CanvasTestHelper();

        drawingService = new DrawingService({} as ResizePoint);
        drawingService.canvas = canvasTestHelper.canvas;
        mouseEvent = { pageX: 1, pageY: 1 } as MouseEvent;
        drawingService.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingService }],
        });
        service = TestBed.inject(BucketService);

        (service as any).added = new Array(2);

        for (let i = 0; i < 2; i++) {
            (service as any).added[i] = new Array(2).fill(false);
        }

        (service as any).pixelStack = new Array();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call localFill in OnClick', () => {
        service.color = '#ff0000';
        const localFillSpy = spyOn(service as any, 'localFill').and.returnValue({});
        (service as any).onClick();
        expect(localFillSpy).toHaveBeenCalled();
        expect((service as any).drawingService.baseCtx.fillStyle).toEqual(service.color);
    });

    it('should call changeColorEverywhere on RightClick', () => {
        service.color = '#ff0000';
        const changeEverywhereSpy = spyOn(service as any, 'changeColorEverywhere').and.returnValue({});
        (service as any).onRightClick();
        expect(changeEverywhereSpy).toHaveBeenCalled();
        expect((service as any).drawingService.baseCtx.fillStyle).toEqual(service.color);
    });

    it('should create the two dimensional array and gather all the information on the selected pixel and then call filArea', () => {
        const getImageDataSpy = spyOn((service as any).drawingService.baseCtx, 'getImageData').and.returnValue({});
        const getPositionSpy = spyOn(service as any, 'getPositionFromMouse').and.returnValue({ x: 1, y: 1 } as Vec2);
        const fillAreaSpy = spyOn(service as any, 'fillArea').and.returnValue({});
        const getColorSpy = spyOn(service as any, 'getColorOfPixel').and.returnValue([]);
        (service as any).localFill(mouseEvent);
        expect(getImageDataSpy).toHaveBeenCalled();
        expect(getPositionSpy).toHaveBeenCalled();
        expect(fillAreaSpy).toHaveBeenCalled();
        expect(getColorSpy).toHaveBeenCalled();

        expect((service as any).added[0][0]).toBeFalse();
    });

    it('should fill all the pixels as the same color as the original one ', () => {
        (service as any).pixelStack = new Array();

        (service as any).pixelStack.push(coords);
        const fillRectSpy = spyOn((service as any).drawingService.baseCtx, 'fillRect').and.returnValue({});
        const addRightPixelSpy = spyOn(service as any, 'addRightPixel').and.returnValue({});
        const addLeftPixelSpy = spyOn(service as any, 'addLeftPixel').and.returnValue({});
        const addTopPixelSpy = spyOn(service as any, 'addTopPixel').and.returnValue({});
        const addBottomPixelSpy = spyOn(service as any, 'addBottomPixel').and.returnValue({});
        const shouldReplacePixelSpy = spyOn(service as any, 'shouldReplacePixel').and.returnValue(true);
        (service as any).fillArea(coords, {} as ImageData);
        expect(fillRectSpy).toHaveBeenCalled();
        expect(addBottomPixelSpy).toHaveBeenCalled();
        expect(addRightPixelSpy).toHaveBeenCalled();
        expect(addTopPixelSpy).toHaveBeenCalled();
        expect(addLeftPixelSpy).toHaveBeenCalled();
        expect(shouldReplacePixelSpy).toHaveBeenCalled();
    });

    it('should not fill all the pixels as the same color as the original one if the pixels arent the same color ', () => {
        (service as any).pixelStack = new Array();

        (service as any).pixelStack.push(coords);
        const fillRectSpy = spyOn((service as any).drawingService.baseCtx, 'fillRect').and.returnValue({});
        const addRightPixelSpy = spyOn(service as any, 'addRightPixel').and.returnValue({});
        const addLeftPixelSpy = spyOn(service as any, 'addLeftPixel').and.returnValue({});
        const addTopPixelSpy = spyOn(service as any, 'addTopPixel').and.returnValue({});
        const addBottomPixelSpy = spyOn(service as any, 'addBottomPixel').and.returnValue({});
        const shouldReplacePixelSpy = spyOn(service as any, 'shouldReplacePixel').and.returnValue(false);
        (service as any).fillArea(coords, {} as ImageData);
        expect(fillRectSpy).not.toHaveBeenCalled();
        expect(addBottomPixelSpy).not.toHaveBeenCalled();
        expect(addRightPixelSpy).not.toHaveBeenCalled();
        expect(addTopPixelSpy).not.toHaveBeenCalled();
        expect(addLeftPixelSpy).not.toHaveBeenCalled();
        expect(shouldReplacePixelSpy).toHaveBeenCalled();
    });

    it('should add the leftPixel to the Stack', () => {
        const isOnCanvasSpy = spyOn(service as any, 'coordsIsOnCanvas').and.returnValue(true);
        const pushSpy = spyOn((service as any).pixelStack, 'push');
        (service as any).addLeftPixel({ x: 1, y: 1 } as Vec2, coords);

        expect((service as any).added[0][1]).toBeTrue();
        expect(pushSpy).toHaveBeenCalled();
        expect(isOnCanvasSpy).toHaveBeenCalled();
    });
    it('should not add the left  pixel to the Stack if the value isnt good', () => {
        (service as any).added[0][1] = true;
        const pushSpy = spyOn((service as any).pixelStack, 'push');
        const isOnCanvasSpy = spyOn(service as any, 'coordsIsOnCanvas').and.returnValue(true);
        (service as any).addLeftPixel({ x: 1, y: 1 } as Vec2, coords);

        expect(pushSpy).not.toHaveBeenCalled();
        expect(isOnCanvasSpy).toHaveBeenCalled();
    });

    it('should add the right pixel to the Stack', () => {
        const isOnCanvasSpy = spyOn(service as any, 'coordsIsOnCanvas').and.returnValue(true);
        const pushSpy = spyOn((service as any).pixelStack, 'push');
        (service as any).addRightPixel({ x: 0, y: 1 } as Vec2, coords);

        expect((service as any).added[1][1]).toBeTrue();
        expect(isOnCanvasSpy).toHaveBeenCalled();

        expect(pushSpy).toHaveBeenCalled();
    });

    it('should not add the right pixel to the Stack if the value isnt good', () => {
        (service as any).added[1][1] = true;
        const pushSpy = spyOn((service as any).pixelStack, 'push');
        const isOnCanvasSpy = spyOn(service as any, 'coordsIsOnCanvas').and.returnValue(true);
        (service as any).addRightPixel({ x: 0, y: 1 } as Vec2, coords);

        expect(pushSpy).not.toHaveBeenCalled();
        expect(isOnCanvasSpy).toHaveBeenCalled();
    });
    it('should add the top pixel to the Stack', () => {
        const pushSpy = spyOn((service as any).pixelStack, 'push');
        const isOnCanvasSpy = spyOn(service as any, 'coordsIsOnCanvas').and.returnValue(true);
        (service as any).addTopPixel({ x: 0, y: 0 } as Vec2, coords);
        expect(pushSpy).toHaveBeenCalled();
        expect((service as any).added[0][1]).toBeTrue();
        expect(isOnCanvasSpy).toHaveBeenCalled();
    });
    it('should not add the top pixel to the Stack if the value isnt good', () => {
        (service as any).added[0][1] = true;
        const pushSpy = spyOn((service as any).pixelStack, 'push');
        const isOnCanvasSpy = spyOn(service as any, 'coordsIsOnCanvas').and.returnValue(true);
        (service as any).addTopPixel({ x: 0, y: 0 } as Vec2, coords);

        expect(pushSpy).not.toHaveBeenCalled();
        expect(isOnCanvasSpy).toHaveBeenCalled();
    });

    it('should add the bottom pixel to the Stack', () => {
        const isOnCanvasSpy = spyOn(service as any, 'coordsIsOnCanvas').and.returnValue(true);
        (service as any).addBottomPixel({ x: 0, y: 1 } as Vec2, coords);

        expect((service as any).added[0][0]).toBeTrue();
        expect(isOnCanvasSpy).toHaveBeenCalled();
    });

    it('should not add the bottom pixel to the Stack if the value isnt good', () => {
        (service as any).added[0][0] = true;
        const pushSpy = spyOn((service as any).pixelStack, 'push');
        const isOnCanvasSpy = spyOn(service as any, 'coordsIsOnCanvas').and.returnValue(true);
        (service as any).addBottomPixel({ x: 0, y: 1 } as Vec2, coords);

        expect(pushSpy).not.toHaveBeenCalled();
        expect(isOnCanvasSpy).toHaveBeenCalled();
    });

    it('should check if the coordinates are on the canvas', () => {
        expect((service as any).coordsIsOnCanvas({ x: 1, y: 1 })).toBeTrue();
    });

    it('should find the color values for a specific pixel', () => {
        (service as any).drawingService.baseCtx.fillStyle = 'black';

        const maxValue = 255;
        // Draw a point then get its value
        (service as any).drawingService.baseCtx.fillRect(0, 0, 1, 1);
        const image: ImageData = (service as any).drawingService.baseCtx.getImageData(0, 0, 2, 2);
        expect((service as any).getColorOfPixel(0, 0, image)).toEqual([0, 0, 0, maxValue]);
    });

    it('should replace the pixel', () => {
        const colorSpy = spyOn(service as any, 'getColorOfPixel').and.returnValue([0, 0, 0]);
        const acceptableSpy = spyOn(service as any, 'isAcceptableValue').and.returnValue(true);
        (service as any).shouldReplacePixel({ x: 0, y: 0 }, [1, 1, 1], {} as ImageData);
        expect(colorSpy).toHaveBeenCalled();
        expect(acceptableSpy).toHaveBeenCalled();
    });

    it('should check if the pixel value is acceptable and return true if it is', () => {
        expect((service as any).isAcceptableValue([0, 0, 0, 0], [0, 0, 0, 0])).toBeTrue();
    });

    it('should check if the pixel value is acceptable and return false if it isnt', () => {
        expect((service as any).isAcceptableValue([0, 0, 0, 0], [1, 1, 0, 0])).toBeFalse();
    });
    it('should change the color even if the pixels are not side by side', () => {
        const getPositionSpy = spyOn(service as any, 'getPositionFromMouse').and.returnValue({ x: 1, y: 1 } as Vec2);
        const acceptableSpy = spyOn(service as any, 'isAcceptableValue').and.returnValue(true);
        const getColorSpy = spyOn(service as any, 'getColorOfPixel').and.returnValue([0, 0, 0, 0]);
        const fillRectSpy = spyOn((service as any).drawingService.baseCtx, 'fillRect').and.returnValue({});
        (service as any).changeColorEverywhere({});
        expect(fillRectSpy).toHaveBeenCalled();
        expect(getColorSpy).toHaveBeenCalled();
        expect(getPositionSpy).toHaveBeenCalled();
        expect(acceptableSpy).toHaveBeenCalled();
    });

    it('should not change the color even if the pixels are not side by side if the pixels arent the same', () => {
        const getPositionSpy = spyOn(service as any, 'getPositionFromMouse').and.returnValue({ x: 1, y: 1 } as Vec2);
        const acceptableSpy = spyOn(service as any, 'isAcceptableValue').and.returnValue(false);
        const getColorSpy = spyOn(service as any, 'getColorOfPixel').and.returnValue([0, 0, 0, 0]);
        const fillRectSpy = spyOn((service as any).drawingService.baseCtx, 'fillRect').and.returnValue({});
        (service as any).changeColorEverywhere({});
        expect(fillRectSpy).not.toHaveBeenCalled();
        expect(getColorSpy).toHaveBeenCalled();
        expect(getPositionSpy).toHaveBeenCalled();
        expect(acceptableSpy).toHaveBeenCalled();
    });
});
