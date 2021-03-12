import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AerosolService } from './aerosol-service.service';

describe('AerosolServiceService', () => {
    let service: AerosolService;
    let mouseEvent: MouseEvent;
    let pos: Vec2;
    let timeoutSpy: jasmine.Spy<any>;
    let drawSpraySpy: jasmine.Spy<any>;

    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

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
        drawSpraySpy = spyOn(service, 'drawSpray');

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;

        pos = {
            x: mouseEvent.offsetX,
            y: mouseEvent.offsetY,
        } as Vec2;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('rng generates a random number between -max et max', () => {
        // It just works, trust me
        let result = true;

        const max = 5;
        const nbTest = max * 250;

        for (let i = 0; i < nbTest && result; i++) {
            const value = service.rng(max);
            result = Math.abs(value) <= max;
        }

        expect(result).toBeTrue();
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
        expect(sprayPointsSpy).toHaveBeenCalledWith(service.lastPosition, service.sprayRadius, service.sprayAmountPerSecond);
        expect(drawSpraySpy).toHaveBeenCalledWith(previewCtxStub);
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
        service.onMouseUp(mouseEvent);
        expect(drawSpraySpy).toHaveBeenCalledWith(baseCtxStub);
    });

    it('showRadius shows the a circle of defined radius at relevant position', () => {
        const radius = 5;
        const ellipseSpy = spyOn(previewCtxStub, 'ellipse');
        const strokeSpy = spyOn(previewCtxStub, 'stroke');

        (service as any).showRadius(pos, radius);
        expect(drawSpraySpy).toHaveBeenCalledWith(previewCtxStub);
        expect(ellipseSpy).toHaveBeenCalled();
        expect(strokeSpy).toHaveBeenCalled();
    });

    it('sprayPoints adds x points in defined radius', () => {
        const x = 25;
        const addpointSpy = spyOn(service, 'addPoint');
        service.sprayPoints(pos, 10, x);
        expect((service as any).pathData.length).toEqual(x);
        expect(addpointSpy).toHaveBeenCalledTimes(x);
    });

    it('addPoint Creates a random point within the bounds', () => {
        const radius = 10;
        pos = { x: 0, y: 0 };
        const rngSpy = spyOn(service, 'rng').and.callThrough();
        const distanceSpy = spyOn(service, 'distance').and.callThrough();
        const point = service.addPoint(pos, radius);
        console.log(point);
        expect(rngSpy).toHaveBeenCalled();
        expect(distanceSpy).toHaveBeenCalled();
        expect(service.distance(point.x, point.y)).toBeLessThanOrEqual(radius);
    });

    it('drawSpray', () => {
      drawSpraySpy.and.callThrough();
        for (let i = 0; i < 10; i++){
          (service as any).pathData.push({ x: i, y: i} as Vec2);
        }

        const ellipseSpy = spyOn(previewCtxStub, 'ellipse');
        const strokeSpy = spyOn(previewCtxStub, 'stroke');

        service.drawSpray(previewCtxStub);
        expect(ellipseSpy).toHaveBeenCalledTimes(10);
        expect(strokeSpy).toHaveBeenCalledTimes(10);
    });

    it('distance', () => {
        expect(service.distance(3,4)).toEqual(5);
    });
});
