import { TestBed } from '@angular/core/testing';
import { ServiceCalculator } from '@app/classes/service-calculator';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LassoService } from './lasso.service';
import { SelectionService } from './selection.service';

// tslint:disable: no-any
describe('LassoService', () => {
    let service: LassoService;
    let mouseEvent: MouseEvent;
    let passSpy: jasmine.Spy;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let ctxSpy: jasmine.SpyObj<CanvasRenderingContext2D>;
    let selectionSpy: jasmine.SpyObj<SelectionService>;
    let testPath: Vec2[];
    const width = 50;
    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        ctxSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['stroke', 'beginPath', 'lineTo', 'getImageData', 'putImageData']);
        selectionSpy = jasmine.createSpyObj('SelectionService', ['setTopLeftHandler', 'setPathData', 'drawBorder']);
        drawServiceSpy.baseCtx = ctxSpy;
        drawServiceSpy.previewCtx = ctxSpy;
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                // { provide: SelectionService, useValue:selectionSpy},
            ],
        });
        service = TestBed.inject(LassoService);

        (service as any).selectionService = selectionSpy;
        mouseEvent = { pageX: Globals.SIDEBAR_WIDTH + width, pageY: 50, button: Globals.MouseButton.Left } as MouseEvent;
        passSpy = spyOn(service, 'passToSelectionService');
        testPath = [
            { x: 0, y: 0 },
            { x: 0, y: 100 },
            { x: -50, y: 50 },
        ];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onClick', () => {
        service.toolMode = 'selection';
        const spy = spyOn(service, 'addPoint');
        service.onClick(mouseEvent);
        expect(spy).toHaveBeenCalled();

        service.toolMode = 'movement';
        const selectAreaSpy = spyOn(service, 'selectArea');
        service.onClick(mouseEvent);

        expect(passSpy).toHaveBeenCalled();
        expect(selectAreaSpy).toHaveBeenCalled();
        expect((service as any).pathData).toEqual([]);
    });

    it('onClick not called when wrong button is pressed', () => {
        const spy = spyOn(service, 'addPoint');
        mouseEvent = {
            pageX: Globals.SIDEBAR_WIDTH + width,
            pageY: 50,
            button: Globals.MouseButton.Right,
        } as MouseEvent;
        service.onClick(mouseEvent);
        expect(spy).not.toHaveBeenCalled();
    });
    it('onMouseMove', () => {
        service.toolMode = 'selection';
        (service as any).pathData = testPath;
        service.onMouseMove(mouseEvent);
        expect(ctxSpy.strokeStyle).toEqual('red');
        expect(ctxSpy.stroke).toHaveBeenCalled();

        mouseEvent = {
            pageX: Globals.SIDEBAR_WIDTH + 0,
            pageY: 0,
            button: Globals.MouseButton.Left,
        } as MouseEvent;

        service.onMouseMove(mouseEvent);
        expect(ctxSpy.strokeStyle).toEqual('black');
        expect(ctxSpy.stroke).toHaveBeenCalled();
    });

    it('onMouseMove should do nothing when not in selection', () => {
        service.toolMode = 'movement';
        (service as any).pathData = testPath;
        service.onMouseMove(mouseEvent);
        expect(ctxSpy.strokeStyle).not.toEqual('red');
        expect(ctxSpy.stroke).not.toHaveBeenCalled();

        service.toolMode = 'selection';
        (service as any).pathData = [];
        service.onMouseMove(mouseEvent);
        expect(ctxSpy.strokeStyle).not.toEqual('red');
        expect(ctxSpy.stroke).not.toHaveBeenCalled();
    });

    it('addPoint', () => {
        (service as any).pathData = testPath;
        service.addPoint({ x: 50, y: 50 });
        expect((service as any).pathData).toEqual(testPath);
        service.addPoint({ x: 0, y: 0 });
        testPath.push({ x: 0, y: 0 });
        expect((service as any).pathData).toEqual(testPath);

        testPath = [
            { x: 0, y: 0 },
            { x: 0, y: 50 },
        ];
        (service as any).pathData = testPath;
        service.addPoint({ x: 25, y: 35 });
        testPath.push({ x: 25, y: 35 });
        expect((service as any).pathData).toEqual(testPath);
    });

    it('checkIsPointValid', () => {
        (service as any).pathData = testPath;
        expect(service.checkIsPointValid({ x: 50, y: 50 })).toBeFalse();
        expect(service.checkIsPointValid({ x: -50, y: -50 })).toBeTrue();
        (service as any).pathData = [];
        expect(service.checkIsPointValid({ x: -50, y: -50 })).toBeTrue();
    });

    it('selectArea', () => {
        ctxSpy.getImageData.and.callFake(() => {
            return new ImageData(1, 1);
        });
        const result = service.selectArea(testPath);
        const expectedSize = ServiceCalculator.maxSize(testPath);
        expect(result.height).toEqual(expectedSize[1].y - expectedSize[0].y);
        expect(result.width).toEqual(expectedSize[1].x - expectedSize[0].x);
        expect(ctxSpy.getImageData).toHaveBeenCalled();
    });

    it('passToSelectionService', () => {
        const image = new ImageData(1, 1);
        (service as any).pathData = testPath;
        passSpy.and.callThrough();
        service.passToSelectionService(image);
        expect(selectionSpy.setTopLeftHandler).toHaveBeenCalled();
        expect(selectionSpy.setPathData).toHaveBeenCalled();
    });
});
