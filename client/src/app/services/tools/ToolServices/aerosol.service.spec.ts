import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { SIDEBAR_WIDTH } from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AerosolService } from '@app/services/tools/ToolServices/aerosol.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';

// tslint:disable: no-any
describe('AerosolService', () => {
    let service: AerosolService;
    let mouseEvent: MouseEvent;
    let pos: Vec2;
    let timeoutSpy: jasmine.Spy<any>;
    let drawSpraySpy: jasmine.Spy<any>;
    let dispatchSpy: jasmine.Spy<any>;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    let points: Vec2[];

    const mouseEventPosTestNumber = 25;
    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service = TestBed.inject(AerosolService);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        timeoutSpy = spyOn(service, 'onTimeout');
        drawSpraySpy = spyOn(service as any, 'drawSpray');
        dispatchSpy = spyOn<any>(service, 'dispatchAction');

        mouseEvent = {
            pageX: mouseEventPosTestNumber + SIDEBAR_WIDTH,
            pageY: mouseEventPosTestNumber,
            button: 0,
        } as MouseEvent;

        pos = {
            x: mouseEvent.pageX,
            y: mouseEvent.pageY,
        } as Vec2;

        points = [];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set lastPosition to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };

        service.onMouseDown(mouseEvent);
        expect(service.lastPosition).toEqual(expectedResult);
    });

    it(' mouseDown should call onTimeout', () => {
        service.onMouseDown(mouseEvent);
        expect(timeoutSpy).toHaveBeenCalled();
    });

    it(' mouseMove should set lastPosition to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        const radius = 25;
        service.sprayRadius = radius;
        const spy = spyOn<any>(service, 'showRadius');
        service.onMouseMove(mouseEvent);
        expect(spy).toHaveBeenCalledWith(expectedResult, radius);
        expect(service.lastPosition).toEqual(expectedResult);
    });

    it(' onTimeout should call sprayPoints and drawSpray if mouse is down', () => {
        timeoutSpy.and.callThrough();
        const sprayPointsSpy = spyOn<any>(service, 'sprayPoints');

        service.mouseDown = true;
        service.lastPosition = { x: 25, y: 25 };
        service.onTimeout();
        expect(sprayPointsSpy).toHaveBeenCalledWith(service.lastPosition, service.sprayRadius);
        expect(drawSpraySpy).toHaveBeenCalledWith(previewCtxStub, []);
    });

    it(' onTimeout should not call sprayPoints and drawSpray if mouse is not down', () => {
        timeoutSpy.and.callThrough();
        const sprayPointsSpy = spyOn<any>(service, 'sprayPoints');

        service.mouseDown = false;
        service.lastPosition = { x: 25, y: 25 };
        service.onTimeout();
        expect(sprayPointsSpy).not.toHaveBeenCalled();
        expect(drawSpraySpy).not.toHaveBeenCalled();
    });

    it('onMouseUp draws the spray on baseCtx', () => {
        service.mouseDown = true;
        service.onMouseUp(mouseEvent);
        expect(drawSpraySpy).toHaveBeenCalledWith(baseCtxStub, []);
        expect(dispatchSpy).toHaveBeenCalled();
    });

    it('onMouseUp doesnt draw the spray on baseCtx', () => {
        service.mouseDown = false;
        service.onMouseUp(mouseEvent);
        expect(drawSpraySpy).not.toHaveBeenCalledWith(baseCtxStub, []);
        expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('showRadius shows the a circle of defined radius at relevant position', () => {
        const radius = 5;
        const ellipseSpy = spyOn(previewCtxStub, 'ellipse');
        const strokeSpy = spyOn(previewCtxStub, 'stroke');

        (service as any).showRadius(pos, radius);
        expect(drawSpraySpy).toHaveBeenCalledWith(previewCtxStub, []);
        expect(ellipseSpy).toHaveBeenCalled();
        expect(strokeSpy).toHaveBeenCalled();
    });

    it('sprayPoints adds x points in defined radius', () => {
        const addpointSpy = spyOn(service as any, 'addPoint');
        const radius = 10;
        (service as any).sprayPoints(pos, radius);
        expect((service as any).pathData.length).toEqual(1);
        expect(addpointSpy).toHaveBeenCalledTimes(1);
    });

    it('drawSpray', () => {
        drawSpraySpy.and.callThrough();
        const numberOfPointsToTest = 10;
        for (let i = 0; i < numberOfPointsToTest; i++) {
            points.push({ x: i, y: i } as Vec2);
        }

        const ellipseSpy = spyOn(previewCtxStub, 'ellipse');
        const strokeSpy = spyOn(previewCtxStub, 'stroke');

        (service as any).drawSpray(previewCtxStub, points);
        expect(ellipseSpy).toHaveBeenCalledTimes(numberOfPointsToTest);
        expect(strokeSpy).toHaveBeenCalledTimes(numberOfPointsToTest);
    });

    it('distance', () => {
        // tslint:disable-next-line: no-magic-numbers
        expect((service as any).distance(3, 4)).toEqual(5);
    });

    it('doAction', () => {
        const numberOfPointsToTest = 5;
        for (let i = 0; i < numberOfPointsToTest; i++) {
            (service as any).sprayPoints({ x: 25, y: 25 }, numberOfPointsToTest);
        }

        const action: DrawAction = (service as any).createAction();
        service.clearPath();
        service.doAction(action);
        expect(drawSpraySpy).toHaveBeenCalledWith(action.canvas, action.setting.pathData);
    });

    it('onMouseUp should dispatch saveState Event', () => {
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);
        service.mouseDown = true;
        service.onMouseUp(mouseEvent);
        expect(spyDispatch).toHaveBeenCalled();
    });
});
