/* tslint:disable:no-unused-variable */
// tslint:disable:no-any
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from './grid.service';

describe('GridService', () => {
    let service: GridService;
    let canvasTestHelper: CanvasTestHelper;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let gridCtxSpy: jasmine.SpyObj<CanvasRenderingContext2D>;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['resetCanvas', 'initializeCanvas', 'setCanvassSize', 'clearCanvas']);
        gridCtxSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['lineTo', 'beginPath', 'stroke', 'moveTo']);
        drawingServiceSpy.gridCtx = gridCtxSpy;

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        service = TestBed.inject(GridService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.drawingService.canvas = canvasTestHelper.canvas;
    });

    it('should be created ', () => {
        expect(service).toBeTruthy();
    });

    it('drawGrid is called when an grid is dispatched', () => {
        const spy = spyOn(service, 'drawGrid');
        dispatchEvent(new CustomEvent('grid'));
        expect(spy).toHaveBeenCalled();
    });
    it('drawGrid does nothing if show grid is false', () => {
        service.showGrid = false;
        service.drawGrid();
        expect(drawingServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });
    it('drawGrid draws vertical and horizontal lines if show grid is true', () => {
        service.showGrid = true;
        service.drawGrid();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(gridCtxSpy.beginPath).toHaveBeenCalled();
        expect(gridCtxSpy.lineTo).toHaveBeenCalled();
        expect(gridCtxSpy.stroke).toHaveBeenCalledTimes(1);
    });
    it('toggleGrid clears gridCanvas  and puts show grid at false if it was at true', () => {
        service.showGrid = true;
        service.toggleGrid();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.showGrid).toEqual(false);
    });
    it('toggleGrid calls draw grid  and puts show grid at true if it was at false', () => {
        service.showGrid = false;
        const spy = spyOn(service, 'drawGrid');
        service.toggleGrid();
        expect(spy).toHaveBeenCalled();
        expect(service.showGrid).toEqual(true);
    });
    it('resetGrid makes sure all values are back to their original state', () => {
        service.showGrid = true;
        service.boxSize = 1;
        service.opacity = 1;
        service.resetGrid();
        expect(service.boxSize).toEqual(Globals.GRID_BOX_INIT_VALUE);
        expect(service.opacity).toEqual(Globals.GRID_OPACITY_INIT_VALUE);
        expect(service.showGrid).toEqual(false);
    });
    it('shortcutIncrementGrid does nothing if new size is too big', () => {
        const testValue = 97;
        service.showGrid = true;
        service.boxSize = testValue;

        service.shortcutIncrementGrid();
        expect(service.boxSize).toEqual(testValue);
    });
    it('shortcutIncrementGrid increments of 5 boxSize if new size is within bounds', () => {
        const testValue = 95;
        service.showGrid = true;
        service.boxSize = testValue;

        service.shortcutIncrementGrid();
        expect(service.boxSize).toEqual(Globals.GRID_MAX_BOX_VALUE);
    });
    it('shortcutDecrementGrid does nothing if new size is too big', () => {
        const testValue = 12;
        service.showGrid = true;
        service.boxSize = testValue;

        service.shortcutDecrementGrid();
        expect(service.boxSize).toEqual(testValue);
    });
    it('shortcutDecrementGrid decrements of 5 boxSize if new size is within bounds', () => {
        const testValue = 15;
        service.showGrid = true;
        service.boxSize = testValue;

        service.shortcutDecrementGrid();
        expect(service.boxSize).toEqual(Globals.GRID_MIN_BOX_VALUE);
    });
});
