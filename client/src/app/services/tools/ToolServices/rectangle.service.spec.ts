import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';
import { RectangleService } from './rectangle.service';

// tslint:disable:no-any
describe('RectangleService', () => {
    let service: RectangleService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let testPath: Vec2[];

    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let dispatchSpy: jasmine.Spy<any>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    // Function Spies
    let drawRectangleSpy: jasmine.Spy<any>;
    let drawBorderSpy: jasmine.Spy<any>;
    let fillSpy: jasmine.Spy<any>;
    let pointSpy: jasmine.Spy<any>;
    let clearPathSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(RectangleService);
        drawRectangleSpy = spyOn<any>(service, 'drawRectangle').and.callThrough();
        drawBorderSpy = spyOn<any>(service, 'drawBorder').and.callThrough();
        fillSpy = spyOn<any>(service, 'fill').and.callThrough();
        pointSpy = spyOn<any>(service, 'getRectanglePoints').and.callThrough();
        clearPathSpy = spyOn<any>(service, 'clearPath').and.callThrough();
        dispatchSpy = spyOn<any>(service, 'dispatchAction');
        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            // tslint:disable-next-line: no-magic-numbers
            pageX: 25 + Globals.SIDEBAR_WIDTH,
            pageY: 25,
            button: 0,
        } as MouseEvent;

        testPath = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 0, y: 1 },
        ];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position and place it in the pathData', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
        expect(service.getPath().length).toEqual(1);
        expect(service.getPath()[0]).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: Globals.MouseButton.Right,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call drawRectangle if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        // Put down mouse
        service.onMouseDown(mouseEvent);
        // Rise it back up
        service.onMouseUp(mouseEvent);
        expect(pointSpy).toHaveBeenCalled();
        expect(drawRectangleSpy).toHaveBeenCalled();
        expect(clearPathSpy).toHaveBeenCalled();
        expect(dispatchSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawRectangle if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(pointSpy).not.toHaveBeenCalled();
        expect(drawRectangleSpy).not.toHaveBeenCalled();
        expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawRectangle if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(pointSpy).toHaveBeenCalled();
        expect(drawRectangleSpy).toHaveBeenCalled();
        expect(clearPathSpy).toHaveBeenCalled();
        expect(service.getPath()[0]).toEqual(service.mouseDownCoord);
    });

    it(' onMouseMove should not call drawRectangle if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(pointSpy).not.toHaveBeenCalled();
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });

    it('OnShift sets the value of shifted and autoruns move', () => {
        const spy = spyOn<any>(service, 'onMouseMove').and.callThrough();
        service.shift = false;
        service.onShift(true);
        expect(service.shift).toBe(true);

        expect(spy).toHaveBeenCalled();
    });

    /*it('drawRectangle calls stroke', () => {
        const spy = spyOn<any>(previewCtxStub, 'stroke').and.callThrough();
        (service as any).drawRectangle(previewCtxStub, testPath);
        expect(spy).toHaveBeenCalled();
    });*/

    // Exemple de test d'intégration qui est quand même utile
    it(' Setting the tool mode to border should call drawBorder ', () => {
        service.toolMode = 'border';

        (service as any).drawRectangle(previewCtxStub, testPath);
        expect(drawBorderSpy).toHaveBeenCalled();
    });

    it(' Setting the tool mode to fill should call drawBorder ', () => {
        service.toolMode = 'fill';
        (service as any).drawRectangle(previewCtxStub, testPath);
        expect(fillSpy).toHaveBeenCalled();
    });

    it(' Setting the tool mode to fillBorder should call drawBorder and fill', () => {
        service.toolMode = 'fillBorder';
        (service as any).drawRectangle(previewCtxStub, testPath);

        expect(fillSpy).toHaveBeenCalled();
        expect(drawBorderSpy).toHaveBeenCalled();
    });

    it(' drawBorder creates the border', () => {
        const spy = spyOn<any>(previewCtxStub, 'lineTo').and.callThrough();
        const expectedResult = 4;
        service.toolMode = 'border';
        (service as any).drawBorder(previewCtxStub, testPath);
        expect(spy).toHaveBeenCalledTimes(expectedResult);
    });

    it(' fill creates a filled rectangle', () => {
        const spy = spyOn<any>(previewCtxStub, 'fillRect').and.callThrough();
        (service as any).fill(previewCtxStub, testPath);
        expect(spy).toHaveBeenCalled();
    });

    it(' clearPath empties the path', () => {
        (service as any).pathData = testPath;
        (service as any).clearPath();
        expect(service.getPath().length).toEqual(0);
    });

    it('getRectanglePoints returns a square when shift is true', () => {
        service.shift = true;
        let points: Vec2[] = [];
        const a: Vec2 = { x: 0, y: 0 };
        const b: Vec2 = { x: 6, y: 10 };
        const c: Vec2 = { x: -3, y: 10 };
        const expectedResultB: Vec2 = { x: 10, y: 10 };
        const expectedResultC: Vec2 = { x: -10, y: 10 };
        service.getPath().push(a);
        points = service.getRectanglePoints(b);
        expect(points[2]).toEqual(expectedResultB);

        points = service.getRectanglePoints(c);
        expect(points[2]).toEqual(expectedResultC);
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
        expect(drawRectangleSpy).toHaveBeenCalledWith(action.canvas, action.setting.pathData);
    });

    it('onMouseUp should dispatch saveState Event', () => {
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);
        service.onMouseUp(mouseEvent);
        expect(spyDispatch).toHaveBeenCalled();
    });
});
