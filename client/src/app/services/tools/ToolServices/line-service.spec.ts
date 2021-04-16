import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { SIDEBAR_WIDTH } from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';
import { LineService } from './line-service';

// tslint:disable:no-any
describe('LineService', () => {
    let service: LineService;
    let mouseEvent: MouseEvent;
    let mouseEvent2: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let pointToPushSpy: jasmine.Spy<any>;
    let dispatchSpy: jasmine.Spy<any>;
    let vec: Vec2[];
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy<any>;
    let distanceSpy: jasmine.Spy<any>;

    const mouseEventPosTestNumber = 10;
    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(LineService);
        drawLineSpy = spyOn<any>(service, 'drawLine');
        pointToPushSpy = spyOn<any>(service, 'getPointToPush').and.callThrough();
        distanceSpy = spyOn<any>(service, 'distanceBewteenPoints').and.callThrough();
        dispatchSpy = spyOn<any>(service, 'dispatchAction');

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            pageX: mouseEventPosTestNumber + SIDEBAR_WIDTH,
            pageY: mouseEventPosTestNumber,
            button: 0,
        } as MouseEvent;

        mouseEvent2 = {
            pageX: mouseEventPosTestNumber + SIDEBAR_WIDTH,
            pageY: mouseEventPosTestNumber,
            button: 1,
        } as MouseEvent;

        vec = [
            { x: 0, y: 0 },
            { x: 150, y: 150 },
        ];

        (service as any).pathData = vec.copyWithin(0, 0);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' onMouseUp should not call drawLine if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawLine', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.toolMode = 'noPoint';
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalledWith(previewCtxStub);
        expect(drawLineSpy).toHaveBeenCalledWith(previewCtxStub, (service as any).pathData);
        expect(pointToPushSpy).toHaveBeenCalledWith(mouseEvent);
        expect((service as any).pathData).toEqual(vec);
    });

    it(' onClick should call drawLine', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onClick(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalledWith(previewCtxStub);
        expect(drawLineSpy).toHaveBeenCalledWith(previewCtxStub, vec);
    });

    it(' onClick should not call drawLine', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onClick(mouseEvent2);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalledWith(previewCtxStub);
        expect(drawLineSpy).not.toHaveBeenCalledWith(previewCtxStub, vec);
    });

    it('onDbClick should place the last point as the first when mouseEvent is within range of the first point', () => {
        // pointToPushSpy.and.callThrough();
        (service as any).pathData.push({ x: 0, y: 0 }, { x: 0, y: 0 });
        service.ondbClick(mouseEvent);
        expect(distanceSpy).toHaveBeenCalled();
        expect((service as any).pathData[length - 1]).toEqual((service as any).pathData[0]);
        const expectedParam: Vec2[] = [
            { x: 0, y: 0 },
            { x: 150, y: 150 },
            { x: 0, y: 0 },
        ];
        expect(drawLineSpy).toHaveBeenCalledWith(baseCtxStub, expectedParam);
        expect(dispatchSpy).toHaveBeenCalled();
    });

    it('onDbClick should not place the last point as the first when mouseEvent is within range of the first point', () => {
        // pointToPushSpy.and.callThrough();
        (service as any).pathData.push({ x: 0, y: 0 }, { x: 0, y: 0 });
        service.ondbClick(mouseEvent2);
        expect(distanceSpy).not.toHaveBeenCalled();
        expect((service as any).pathData[length - 1]).not.toEqual((service as any).pathData[0]);
        const expectedParam: Vec2[] = [
            { x: 0, y: 0 },
            { x: 150, y: 150 },
            { x: 0, y: 0 },
        ];
        expect(drawLineSpy).not.toHaveBeenCalledWith(baseCtxStub, expectedParam);
        expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('onDbClick should place the last point as the first when mouseEvent is within range of the first point', () => {
        // pointToPushSpy.and.callThrough();
        (service as any).pathData = [];
        service.ondbClick(mouseEvent);
        expect(distanceSpy).not.toHaveBeenCalled();
        expect((service as any).pathData.length).toEqual(0);
        expect(drawLineSpy).not.toHaveBeenCalled();
        expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('onDbClick should place the last point as the first when mouseEvent is within range of the first point', () => {
        (service as any).pathData.push({ x: 0, y: 0 }, { x: 0, y: 0 });
        service.ondbClick(mouseEvent);
        expect(distanceSpy).toHaveBeenCalled();
        expect((service as any).pathData[length - 1]).toEqual((service as any).pathData[0]);
        const expectedParam: Vec2[] = [
            { x: 0, y: 0 },
            { x: 150, y: 150 },
            { x: 0, y: 0 },
        ];
        expect(drawLineSpy).toHaveBeenCalledWith(baseCtxStub, expectedParam);
        expect(dispatchSpy).toHaveBeenCalled();
    });

    it('onDbClick should place the last point as the mouseEvent coords when it is not within range of the first point', () => {
        mouseEvent = {
            // tslint:disable-next-line: no-magic-numbers
            pageX: 20 + SIDEBAR_WIDTH,
            pageY: 20,
            button: 0,
        } as MouseEvent;
        (service as any).pathData.push({ x: 20, y: 20 }, { x: 20, y: 20 });
        service.ondbClick(mouseEvent);
        expect(distanceSpy).toHaveBeenCalled();
        const expectedParam: Vec2[] = [
            { x: 0, y: 0 },
            { x: 150, y: 150 },
            { x: 20, y: 20 },
        ];
        expect(drawLineSpy).toHaveBeenCalledWith(baseCtxStub, expectedParam);
        expect(dispatchSpy).toHaveBeenCalled();
    });

    it('onDbClick should clearPath', () => {
        service.ondbClick(mouseEvent);
        expect((service as any).pathData.length).toEqual(0);
    });

    // Exemple de test d'intégration qui est quand même utile
    it(' should change the pixel of the canvas ', () => {
        const spy = spyOn<any>(baseCtxStub, 'lineTo');
        const pointSpy = spyOn<any>(service, 'drawDot');
        drawLineSpy.and.callThrough();
        service.toolMode = 'noPoint';

        (service as any).drawLine(baseCtxStub, vec);
        expect(spy).toHaveBeenCalledTimes(2);
        expect(pointSpy).not.toHaveBeenCalled();
        // Premier pixel seulement

        service.toolMode = 'point';
        (service as any).drawLine(baseCtxStub, vec);
        const expectedValue = 4;
        expect(spy).toHaveBeenCalledTimes(expectedValue);
        expect(pointSpy).toHaveBeenCalledTimes(1);
    });

    it(' drawDot choses the right colors ', () => {
        const ellipseSpy = spyOn<any>(baseCtxStub, 'ellipse');
        (service as any).drawDot(baseCtxStub, vec);
        expect(ellipseSpy).toHaveBeenCalledTimes(vec.length);
    });

    it(' clearPath should empty path ', () => {
        (service as any).clearPath();
        expect((service as any).pathData.length).toEqual(0);
    });

    it(' distanceBetweenPoints should return the right distance ', () => {
        const expectedValue = 15;
        const pointA: Vec2 = { x: 25, y: 40 };
        const pointB: Vec2 = { x: 34, y: 28 };
        const distance = (service as any).distanceBewteenPoints(pointA, pointB);
        expect(distance).toEqual(expectedValue);
    });

    it(' getAngle should return the angle from the x-axis', () => {
        const expectedValue = -135;
        const pointA: Vec2 = { x: 25, y: 40 };
        const pointB: Vec2 = { x: 20, y: 35 };
        const distance = (service as any).getAngle(pointA, pointB);
        expect(distance).toEqual(expectedValue);
    });

    it(' getShiftAngle should return the angle from the x-axis', () => {
        let expectedValue: Vec2;
        const pointA: Vec2 = { x: 0, y: 0 };
        let pointB: Vec2;
        let distance;

        // Test 1
        expectedValue = { x: 0, y: 15 };
        pointB = { x: 5, y: 15 };
        distance = (service as any).getShiftAngle(pointA, pointB);
        expect(distance).toEqual(expectedValue);

        // Test 2
        expectedValue = { x: 15, y: 0 };
        pointB = { x: 15, y: 5 };
        distance = (service as any).getShiftAngle(pointA, pointB);
        expect(distance).toEqual(expectedValue);

        // Test 3
        expectedValue = { x: 15, y: 15 };
        pointB = { x: 15, y: 15 };
        distance = (service as any).getShiftAngle(pointA, pointB);
        expect(distance).toEqual(expectedValue);

        // Test 4
        expectedValue = { x: 15, y: -15 };
        pointB = { x: 15, y: -15 };
        distance = (service as any).getShiftAngle(pointA, pointB);
        expect(distance).toEqual(expectedValue);

        // Test 5
        expectedValue = { x: -15, y: 15 };
        pointB = { x: -15, y: 15 };
        distance = (service as any).getShiftAngle(pointA, pointB);
        expect(distance).toEqual(expectedValue);

        // Test 6
        expectedValue = { x: -15, y: -15 };
        pointB = { x: -15, y: -15 };
        distance = (service as any).getShiftAngle(pointA, pointB);
        expect(distance).toEqual(expectedValue);
    });

    it(' onShift should set the value of shift and call onMouseMove', () => {
        const spy = spyOn(service, 'onMouseMove');
        service.onShift(true);
        expect(service.shift).toBeTrue();
        expect(spy).toHaveBeenCalledWith(service.lastMoveEvent);
    });

    it('onEscape should clearPath and clear previewCanvas', () => {
        const spy = spyOn<any>(service, 'clearPath');
        service.onEscape();
        expect(spy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('onBackspace should remove a point and call on MouseMove', () => {
        const spy = spyOn<any>(service, 'onMouseMove');
        service.onBackspace();
        expect(spy).toHaveBeenCalledWith(service.lastMoveEvent);
    });

    it('getPointToPush should return mouseposition if pathData is empty', () => {
        const expectedResult = (service as any).getPositionFromMouse(mouseEvent);
        (service as any).clearPath();
        const result = service.getPointToPush(mouseEvent);
        expect(result).toEqual(expectedResult);
    });

    it('getPointToPush should return mouseposition if shift is not pressed', () => {
        const expectedResult = (service as any).getPositionFromMouse(mouseEvent);
        const result = service.getPointToPush(mouseEvent);
        expect(result).toEqual(expectedResult);
    });
    it('getPointToPush should return mouseposition if shift is not pressed', () => {
        const spy = spyOn<any>(service, 'getShiftAngle').and.callFake(() => {
            return { x: 134, y: 125 };
        });
        const expectedResult: Vec2 = { x: 134, y: 125 };
        service.shift = true;
        const result = service.getPointToPush(mouseEvent);
        expect(result).toEqual(expectedResult);
        expect(spy).toHaveBeenCalled();
    });

    it('doAction', () => {
        (service as any).pathData = [
            { x: 0, y: 0 },
            { x: 10, y: 10 },
            { x: 110, y: 110 },
        ];
        const action: DrawAction = (service as any).createAction();
        service.clearPath();
        service.doAction(action);
        expect(drawLineSpy).toHaveBeenCalledWith(action.canvas, action.setting.pathData);
    });

    it('ondbClick should dispatch saveState Event', () => {
        mouseEvent = {
            // tslint:disable-next-line: no-magic-numbers
            pageX: 20 + SIDEBAR_WIDTH,
            pageY: 20,
            button: 0,
        } as MouseEvent;
        (service as any).pathData.push({ x: 20, y: 20 }, { x: 20, y: 20 });
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);
        service.ondbClick(mouseEvent);
        expect(spyDispatch).toHaveBeenCalled();
    });
});
