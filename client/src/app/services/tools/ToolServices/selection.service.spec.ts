import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionMovementService } from '@app/services/selection-movement/selection-movement.service';
import { SelectionResizeService } from '@app/services/selection-resize/selection-resize.service';
import { SelectionService } from './selection.service';
// justifié pour pouvoir faire des spys sur des méthodes privées
// tslint:disable: no-any
describe('SelectionService', () => {
    let service: SelectionService;
    let drawService: DrawingService;
    let selectionMoveService: SelectionMovementService;
    let selectionResizeService: SelectionResizeService;
    let rectangleSpy: jasmine.Spy;
    let drawServiceSpy: jasmine.Spy;
    let selectionSpy: jasmine.Spy;
    let canvasTestHelper: CanvasTestHelper;
    let mouseDownEvent: MouseEvent;
    let mouseUpEvent: MouseEvent;
    let drawBorderSpy: jasmine.Spy;
    let selectAreaSpy: jasmine.Spy;
    let selectionMovementSpy: jasmine.Spy;
    let selectionResizeSpy: jasmine.Spy;
    const width = 100;
    const height = 100;
    const canvasWidth = 500;
    const canvasHeight = 500;
    const pathData = 'pathData';
    const inMovement = 'inMovement';
    const selectedArea = 'selectedArea';
    const rectangleService = 'rectangleService';
    const inResize = 'inResize';
    const resizePathData = 'resizePathData';

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionService);
        drawService = TestBed.inject(DrawingService);
        selectionMoveService = TestBed.inject(SelectionMovementService);
        selectionResizeService = TestBed.inject(SelectionResizeService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawService.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawService.previewCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawService.canvas = canvasTestHelper.canvas;
        drawService.canvas.width = canvasWidth;
        drawService.canvas.height = canvasHeight;
        mouseDownEvent = Globals.mouseDownEvent;
        mouseUpEvent = {
            pageX: 645,
            pageY: 175,
            x: 175,
            y: 175,
            button: 1,
        } as MouseEvent;
        service[pathData] = [
            { x: 100, y: 100 },
            { x: 200, y: 100 },
            { x: 200, y: 200 },
            { x: 100, y: 200 },
        ];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getPathData should return the pathData', () => {
        expect(service.getPathData()).toEqual(service[pathData]);
    });

    it('setPathData should set the pathData with the path passed in arguments', () => {
        const expectedPath = [
            { x: 50, y: 50 },
            { x: 100, y: 50 },
            { x: 100, y: 100 },
            { x: 50, y: 100 },
        ];
        service.setPathData(expectedPath);
        expect(service[pathData]).toEqual(expectedPath);
    });

    it('getActualPosition should return (0,0) if pathData is empty', () => {
        service[pathData] = [];
        expect(service.getActualPosition()).toEqual({ x: 0, y: 0 });
    });

    it('getActualPosition should return the current selection position if pathData contains more than 4 coordinates', () => {
        service[pathData].push({ x: 150, y: 150 });
        expect(service.getActualPosition()).toEqual({ x: 150, y: 150 });
    });

    it('getActualPosition should return the initial selection position if pathData contains 4 or less coordinates', () => {
        expect(service.getActualPosition()).toEqual({ x: 100, y: 100 });
    });

    it('getActualPosition should call getActualResizedPosition from the selection resize service and return its value', () => {
        selectionResizeSpy = spyOn(selectionResizeService, 'getActualResizedPosition');
        service[inResize] = true;
        service.getActualPosition();
        expect(selectionResizeSpy).toHaveBeenCalled();
    });

    it('getSelectionWidth should return 0 if the selectedArea is undefined', () => {
        expect(service.getSelectionWidth()).toEqual(0);
    });

    it('getSelectionWidth should return 0 if there is no active selection', () => {
        service[selectedArea] = drawService.baseCtx.getImageData(width, height, width, height);
        service.inSelection = false;
        expect(service.getSelectionWidth()).toEqual(0);
    });

    it('getSelectionWidth should call getActualResizeWidth from selectionResize if the selection has been resized', () => {
        selectionResizeSpy = spyOn(selectionResizeService, 'getActualResizedWidth');
        service[selectedArea] = drawService.baseCtx.getImageData(width, height, width, height);
        service[inResize] = true;
        service.inSelection = true;
        service.getSelectionWidth();
        expect(selectionResizeSpy).toHaveBeenCalled();
    });

    it('getSelectionWidth should return the width of the selected area if there is a selection', () => {
        service[selectedArea] = drawService.baseCtx.getImageData(width, height, width, height);
        service.inSelection = true;
        expect(service.getSelectionWidth()).toEqual(width);
    });

    it('getSelectionHeight should return 0 if the selectedArea is undefined', () => {
        expect(service.getSelectionHeight()).toEqual(0);
    });

    it('getSelectionHeight should return the height of the selected area if there is a selection', () => {
        service[selectedArea] = drawService.baseCtx.getImageData(width, height, width, height);
        service.inSelection = true;
        expect(service.getSelectionHeight()).toEqual(height);
    });

    it('getSelectionHeight should return 0 if there is no active selection', () => {
        service[selectedArea] = drawService.baseCtx.getImageData(width, height, width, height);
        service.inSelection = false;
        expect(service.getSelectionHeight()).toEqual(0);
    });

    it('getSelectionHeight should call getActualResizeHeight from selectionResize if the selection has been resized', () => {
        selectionResizeSpy = spyOn(selectionResizeService, 'getActualResizedHeight');
        service[selectedArea] = drawService.baseCtx.getImageData(width, height, width, height);
        service[inResize] = true;
        service.inSelection = true;
        service.getSelectionHeight();
        expect(selectionResizeSpy).toHaveBeenCalled();
    });

    it('onMouseDown should set mouseDown to true if it was a left click', () => {
        service.onMouseDown(mouseDownEvent);
        expect(service.mouseDown).toBeTrue();
    });

    it('onMouseDown should call the setPath method of the rectangleService if there is no active selection', () => {
        service.inSelection = false;
        rectangleSpy = spyOn(service[rectangleService], 'setPath');
        service.onMouseDown(mouseDownEvent);
        expect(rectangleSpy).toHaveBeenCalledWith(service[pathData]);
    });

    it('onMouseDown should set inmovement to true and inselection to false if the event occured inside the selected area limits', () => {
        service.inSelection = true;
        service[pathData].push({ x: width, y: height });
        service[selectedArea] = drawService.baseCtx.getImageData(width, height, width, height);
        service.onMouseDown(mouseDownEvent);
        expect(service.inSelection).not.toBeTrue();
        expect(service[inMovement]).toBeTrue();
    });

    it('onMouseDown should call onEscape if the event occured outside the selected area limits', () => {
        const outsideSelection = 1000;
        service.inSelection = true;
        service[inMovement] = false;
        service[inResize] = false;
        service[pathData].push({ x: outsideSelection, y: outsideSelection });
        service[selectedArea] = drawService.baseCtx.getImageData(outsideSelection, outsideSelection, outsideSelection, outsideSelection);
        selectionSpy = spyOn(service, 'onEscape').and.callThrough();
        service.onMouseDown(mouseDownEvent);
        expect(selectionSpy).toHaveBeenCalled();
    });

    it('onMouseDown should set inResize to true and call initializePath from selectionResize if one of the handlers was clicked', () => {
        selectionResizeSpy = spyOn(selectionResizeService, 'onMouseDown').and.returnValue(true);
        const selectionResizeSpy2 = spyOn(selectionResizeService, 'initializePath');
        const selectionResizeSpy3 = spyOn(selectionResizeService, 'setPathDataAfterMovement');
        service.inSelection = true;
        selectionResizeService[resizePathData] = service[pathData];
        service.onMouseDown(mouseDownEvent);
        expect(service[inResize]).toBeTrue();
        expect(selectionResizeSpy2).toHaveBeenCalledWith(service[pathData]);
        expect(selectionResizeSpy3).toHaveBeenCalled();
    });

    it('onMouseMove should do nothing if mouseDown is false', () => {
        service.mouseDown = false;
        drawServiceSpy = spyOn(drawService, 'clearCanvas');
        service.onMouseMove(mouseDownEvent);
        expect(drawServiceSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call clearCanvas if mouseDown is true', () => {
        service.mouseDown = true;
        drawServiceSpy = spyOn(drawService, 'clearCanvas');
        service[rectangleService].setPath(service[pathData]);
        service.onMouseMove(mouseDownEvent);
        expect(drawServiceSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call drawBorder and select area if inMovement and inResize are false', () => {
        service.mouseDown = true;
        service[inMovement] = false;
        service[inResize] = false;
        drawBorderSpy = spyOn<any>(service, 'drawBorder').and.callThrough();
        selectAreaSpy = spyOn<any>(service, 'selectArea').and.callThrough();
        service[rectangleService].setPath(service[pathData]);
        service.onMouseMove(mouseDownEvent);
        expect(drawBorderSpy).toHaveBeenCalled();
        expect(selectAreaSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call updateCanvasOnMove and onMouseMove from selectionMovement service if inMovement is true', () => {
        service.mouseDown = true;
        service[inMovement] = true;
        service[pathData].push({ x: width, y: height });
        service[selectedArea] = drawService.baseCtx.getImageData(width, height, width, height);
        selectionSpy = spyOn<any>(selectionMoveService, 'updateCanvasOnMove').and.callThrough();
        selectionMovementSpy = spyOn(selectionMoveService, 'onMouseMove');
        service.onMouseMove(mouseDownEvent);
        expect(selectionSpy).toHaveBeenCalled();
        expect(selectionMovementSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call onMouseMove from Resize if inResize is true', () => {
        service.mouseDown = true;
        service[inResize] = true;
        service[inMovement] = false;
        service[pathData].push({ x: width, y: height });
        service[selectedArea] = drawService.baseCtx.getImageData(width, height, width, height);
        selectionResizeSpy = spyOn(selectionResizeService, 'onMouseMove');
        service.onMouseMove(mouseDownEvent);
        expect(selectionResizeSpy).toHaveBeenCalled();
    });

    it('onMouseUp should do nothing if mouseDown is false', () => {
        service.mouseDown = false;
        selectionSpy = spyOn(service, 'getPositionFromMouse');
        service.onMouseUp(mouseDownEvent);
        expect(selectionSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should set mouseDown to false if mouseDown is true', () => {
        service.mouseDown = true;
        service[rectangleService].setPath(service[pathData]);
        service.onMouseUp(mouseDownEvent);
        expect(service.mouseDown).not.toBeTrue();
    });

    it('onMouseUp should call setTopLeftHandler and clearCanvas if mouseUp did not occur at the exact same position as the mouseDown event and if inMovement is false', () => {
        service.mouseDown = true;
        service[inMovement] = false;
        selectionSpy = spyOn<any>(service, 'setTopLeftHandler').and.callThrough();
        drawServiceSpy = spyOn(drawService, 'clearCanvas');
        service.onMouseUp(mouseUpEvent);
        expect(selectionSpy).toHaveBeenCalled();
        expect(drawServiceSpy).toHaveBeenCalled();
        expect(service.inSelection).toBeTrue();
    });

    it('onMouseUp should clearPath if the mouseUp event occur at the same position than the mouseDown event', () => {
        service.mouseDown = true;
        service[inMovement] = false;
        selectionSpy = spyOn(service, 'clearPath');
        service[pathData] = [{ x: 125, y: 125 }];
        service.onMouseUp(mouseDownEvent);
        expect(selectionSpy).toHaveBeenCalled();
        expect(service.inSelection).not.toBeTrue();
    });

    it('onMouseUp should call onMouseUp from selection movement, set inMovement to false and inSelection to true if inMovement is true', () => {
        service.mouseDown = true;
        service[inMovement] = true;
        selectionMovementSpy = spyOn(selectionMoveService, 'onMouseUp');
        service.onMouseUp(mouseUpEvent);
        expect(service[inMovement]).not.toBeTrue();
        expect(service.inSelection).toBeTrue();
        expect(selectionMovementSpy).toHaveBeenCalled();
    });

    it('onMouseUp should call onMouseUp from selection resize and getImageData from drawingService if inResize is true', () => {
        service.mouseDown = true;
        service[inMovement] = false;
        service[inResize] = true;
        selectionResizeSpy = spyOn(selectionResizeService, 'onMouseUp').and.returnValue(true);
        selectAreaSpy = spyOn(drawService.previewCtx, 'getImageData');
        selectionSpy = spyOn(service, 'getActualPosition').and.returnValue({ x: 100, y: 100 });
        service.onMouseUp(mouseUpEvent);
        expect(selectionResizeSpy).toHaveBeenCalled();
        expect(selectAreaSpy).toHaveBeenCalled();
    });

    it('onMouseUp should call onMouseUp from selection resize if inResize is true but not the mouseUp', () => {
        service.mouseDown = true;
        service[inMovement] = false;
        service[inResize] = true;
        selectionResizeSpy = spyOn(selectionResizeService, 'onMouseUp').and.returnValue(false);
        selectAreaSpy = spyOn(drawService.previewCtx, 'getImageData');
        service.onMouseUp(mouseUpEvent);
        expect(selectionResizeSpy).toHaveBeenCalled();
        expect(selectAreaSpy).not.toHaveBeenCalled();
    });

    it('onShift should set shift to the argument value and call onMouseMove with the lastMoveEvent', () => {
        selectionSpy = spyOn(service, 'onMouseMove');
        service.onShift(true);
        expect(selectionSpy).toHaveBeenCalled();
    });

    it('onEscape should do nothing if there is no active selection', () => {
        service.inSelection = false;
        selectionSpy = spyOn<any>(service, 'confirmSelectionMove').and.callThrough();
        service.onEscape();
        expect(selectionSpy).not.toHaveBeenCalled();
    });

    it('onEscape should return to Lasso if toolMode matches', () => {
        service.toolMode = Globals.LASSO_SELECTION_SHORTCUT;
        let result = false;
        selectionSpy = spyOn<any>(service, 'confirmSelectionMove');
        service.inSelection = true;
        service.inMovement = false;
        addEventListener('changeTool', (event: CustomEvent) => {
            result = event.detail.nextTool[0] === Globals.LASSO_SELECTION_SHORTCUT && event.detail.nextTool[1] === 'selection';
        });
        service.onEscape();
        expect(service.toolMode).toEqual('');
        expect(result).toBeTrue();
    });
});
