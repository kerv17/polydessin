import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipsisService } from './ellipsis-service';

// tslint:disable:no-any
describe('EllipsisService', () => {
    let service: EllipsisService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(EllipsisService);
        drawLineSpy = spyOn<any>(service, 'drawEllipse').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1, // TODO: Avoir ceci dans un enum accessible
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
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawRectangle if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawRectangle if mouse was already down', () => {
        const expectedValue = 1;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseDown(mouseEvent);

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
        expect(service.getPath().length).toEqual(expectedValue);
    });

    it(' onMouseMove should not call drawRectangle if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' EllipseWidth does what its supposed to do ', () => {
        const WIDTH = 10;
        service.width = WIDTH;
        const a: Vec2 = { x: 0, y: 0 };
        // Bottom right
        {
            const b: Vec2 = { x: 50, y: 50 };
            const s = service.ellipseWidth(a, b);
            const expectedResult: Vec2 = { x: 45, y: 45 };
            expect(s).toEqual(expectedResult);
        }
        // Bottom left
        {
            const b: Vec2 = { x: -50, y: 50 };
            const s = service.ellipseWidth(a, b);
            const expectedResult: Vec2 = { x: 45, y: 45 };
            console.log(s.x);
            expect(s).toEqual(expectedResult);
        }
        // Top right
        {
            const b: Vec2 = { x: 50, y: -50 };
            const s = service.ellipseWidth(a, b);
            const expectedResult: Vec2 = { x: 45, y: 45 };
            expect(s).toEqual(expectedResult);
        }
        // Top left
        {
            const b: Vec2 = { x: -50, y: -50 };
            const s = service.ellipseWidth(a, b);
            const expectedResult: Vec2 = { x: 45, y: 45 };
            console.log(s.x);
            expect(s).toEqual(expectedResult);
        }
    });

    it('getPathForEllipsis does what its supposed to do ', () => {
        {
            service.getPath().push({ x: 0, y: 0 });
            service.shift = false;
            const fakeMousePos: Vec2 = { x: 50, y: 50 };
            (service as any).getPathForEllipsis(fakeMousePos);
            expect(service.getPath().pop()).toEqual({ x: 50, y: 50 });
            expect(service.getPath().pop()).toEqual({ x: 25, y: 25 });
            expect(service.getPath().pop()).toEqual({ x: 0, y: 0 });
        }
        (service as any).clearPath();
        {
            service.getPath().push({ x: 0, y: 0 });
            service.shift = true;
            service.getPerimeterPathData()[2] = { x: 50, y: 50 };
            const fakeMousePos: Vec2 = { x: 40, y: 50 };
            (service as any).getPathForEllipsis(fakeMousePos);
            expect(service.getPath().pop()).toEqual({ x: 50, y: 50 });
            expect(service.getPath().pop()).toEqual({ x: 25, y: 25 });
            expect(service.getPath().pop()).toEqual({ x: 0, y: 0 });
        }
    });

    it('getRectanglePoints returns a square when shift is true', () => {
        const tests: Vec2[] = [
            { x: 6, y: 10 },
            { x: -3, y: 10 },
        ];
        const expectedValues: Vec2[] = [
            { x: 10, y: 10 },
            { x: -10, y: 10 },
        ];
        const points: Vec2[] = [];
        const a: Vec2 = { x: 0, y: 0 };

        service.shift = true;
        {
            service.getPerimeterPathData().push(a);
            (service as any).getRectanglePoints(tests[0]);
            points.push(service.getPerimeterPathData()[2]);
        }

        {
            (service as any).perimerterPathData = [a];
            (service as any).getRectanglePoints(tests[1]);
            points.push(service.getPerimeterPathData()[2]);
        }

        expect(points[0]).toEqual(expectedValues[0]);
        expect(points[1]).toEqual(expectedValues[1]);
    });

    it('Fill changes the center pixels', () => {
        const path: Vec2[] = [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 10, y: 10 },
        ];
        const spy = spyOn(previewCtxStub, 'fill');
        (service as any).toolMode = 'fill';
        (service as any).drawEllipse(previewCtxStub, path);
        expect(spy).toHaveBeenCalled();
    });

    it('border changers the border pixels', () => {
        const path: Vec2[] = [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 10, y: 10 },
        ];
        const spy = spyOn(previewCtxStub, 'ellipse');
        (service as any).toolMode = 'border';
        (service as any).drawEllipse(previewCtxStub, path);
        expect(spy).toHaveBeenCalled();
    });

    it('fillBorder changers the border pixels', () => {
        const path: Vec2[] = [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 10, y: 10 },
        ];

        const ellipseSpy = spyOn(previewCtxStub, 'ellipse');
        const fillSpy = spyOn(previewCtxStub, 'fill');
        (service as any).toolMode = 'fillBorder';
        (service as any).drawEllipse(previewCtxStub, path);
        expect(ellipseSpy).toHaveBeenCalled();
        expect(fillSpy).toHaveBeenCalled();
    });

    it('OnShift sets the value of shifted and autoruns move', () => {
        const spy = spyOn<any>(service, 'onMouseMove').and.callThrough();
        service.shift = false;
        service.onShift(true);
        expect(service.shift).toBe(true);

        expect(spy).toHaveBeenCalled();
    });
});
