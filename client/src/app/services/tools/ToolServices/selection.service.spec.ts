import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionMovementService } from '@app/services/SelectionMovement/selection-movement.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';
import { SelectionService } from './selection.service';
// justifié pour pouvoir faire des spys sur des méthodes privées
// tslint:disable: no-any
describe('SelectionService', () => {
    let service: SelectionService;
    let drawService: DrawingService;
    let selectionMoveService: SelectionMovementService;
    let rectangleSpy: jasmine.Spy;
    let drawServiceSpy: jasmine.Spy;
    let selectionSpy: jasmine.Spy;
    let canvasTestHelper: CanvasTestHelper;
    let mouseDownEvent: MouseEvent;
    let mouseUpEvent: MouseEvent;
    let drawBorderSpy: jasmine.Spy;
    let selectAreaSpy: jasmine.Spy;
    let selectionMovementSpy: jasmine.Spy;
    const width = 100;
    const height = 100;
    const canvasWidth = 500;
    const canvasHeight = 500;
    const pathData = 'pathData';
    const inMovement = 'inMovement';
    const createAction = 'createAction';
    const selectArea = 'selectArea';
    const updateCanvasOnMove = 'updateCanvasOnMove';
    const selectedArea = 'selectedArea';
    const rectangleService = 'rectangleService';
    const setTopLeftHandler = 'setTopLeftHandler';
    const drawBorder = 'drawBorder';
    const confirmSelectionMove = 'confirmSelectionMove';

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionService);
        drawService = TestBed.inject(DrawingService);
        selectionMoveService = TestBed.inject(SelectionMovementService);
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

    it('getSelectionWidth should return 0 if the selectedArea is undefined', () => {
        expect(service.getSelectionWidth()).toEqual(0);
    });

    it('getSelectionWidth should return the width of the selected area if there is a selection', () => {
        service[selectedArea] = drawService.baseCtx.getImageData(width, height, width, height);
        expect(service.getSelectionWidth()).toEqual(width);
    });

    it('getSelectionHeight should return 0 if the selectedArea is undefined', () => {
        expect(service.getSelectionHeight()).toEqual(0);
    });

    it('getSelectionHeight should return the height of the selected area if there is a selection', () => {
        service[selectedArea] = drawService.baseCtx.getImageData(width, height, width, height);
        expect(service.getSelectionHeight()).toEqual(height);
    });

    it('onMouseDown should set mouseDown to true if it was a left click', () => {
        service.onMouseDown(mouseDownEvent);
        expect(service.mouseDown).toBeTrue();
    });

    it('onMouseDown should call the mouseDown method of the rectangleService if there is no active selection', () => {
        service.inSelection = false;
        rectangleSpy = spyOn(service[rectangleService], 'onMouseDown');
        service.onMouseDown(mouseDownEvent);
        expect(rectangleSpy).toHaveBeenCalledWith(mouseDownEvent);
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
        const outsideSelection = 10;
        service.inSelection = true;
        service[pathData].push({ x: width, y: height });
        service[selectedArea] = drawService.baseCtx.getImageData(width, height, outsideSelection, outsideSelection);
        selectionSpy = spyOn(service, 'onEscape');
        service.onMouseDown(mouseDownEvent);
        expect(service.inSelection).toBeTrue();
        expect(service[inMovement]).not.toBeTrue();
        expect(selectionSpy).toHaveBeenCalled();
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

    it('onMouseMove should call drawBorder and select area if inMovement is false', () => {
        service.mouseDown = true;
        service[inMovement] = false;
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
        selectionSpy = spyOn<any>(service, 'updateCanvasOnMove').and.callThrough();
        selectionMovementSpy = spyOn(selectionMoveService, 'onMouseMove');
        service.onMouseMove(mouseDownEvent);
        expect(selectionSpy).toHaveBeenCalled();
        expect(selectionMovementSpy).toHaveBeenCalled();
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

    it('onEscape should call confirmSelectionMove, dispatchAction and reset attributes to their initial values if there is a selection', () => {
        service.inSelection = true;
        selectionSpy = spyOn<any>(service, 'confirmSelectionMove').and.callThrough();
        const selectionSpy2 = spyOn<any>(service, 'dispatchAction').and.callThrough();
        const selectionSpy3 = spyOn(service, 'clearPath');
        service[pathData].push({ x: width, y: height });
        service[selectedArea] = drawService.baseCtx.getImageData(width, height, width, height);
        service.onEscape();
        expect(selectionSpy).toHaveBeenCalled();
        expect(selectionSpy2).toHaveBeenCalled();
        expect(service.inSelection).not.toBeTrue();
        expect(service.mouseDown).not.toBeTrue();
        expect(service[inMovement]).not.toBeTrue();
        expect(selectionSpy3).toHaveBeenCalled();
    });

    it('selectCanvas should call getImageData with the width and height passed as arguments', () => {
        selectAreaSpy = spyOn(drawService.baseCtx, 'getImageData');
        service.selectCanvas(width, height);
        expect(selectAreaSpy).toHaveBeenCalled();
        expect(service.inSelection).toBeTrue();
    });

    it('selectCanvas should set the path based on the width and height arguments', () => {
        service.selectCanvas(width, height);
        expect(service[pathData][0]).toEqual({ x: 0, y: 0 });
        expect(service[pathData][1]).toEqual({ x: 0, y: 100 });
        expect(service[pathData][2]).toEqual({ x: 100, y: 100 });
        expect(service[pathData][Globals.RIGHT_HANDLER]).toEqual({ x: 100, y: 0 });
        expect(service[pathData][Globals.BOTTOM_RIGHT_HANDLER]).toEqual({ x: 0, y: 0 });
    });

    it('doAction should call saveSetting, loadSetting, selectArea and confirmSelectionMove', () => {
        const action: DrawAction = service[createAction]();
        selectAreaSpy = spyOn<any>(service, 'selectArea').and.callThrough();
        selectionSpy = spyOn<any>(service, 'loadSetting');
        service[pathData].push({ x: width, y: height });
        service.doAction(action);
        expect(selectAreaSpy).toHaveBeenCalled();
        expect(selectionSpy).toHaveBeenCalled();
    });

    it('selectArea should call getImageData if the width and height are not 0', () => {
        drawServiceSpy = spyOn(drawService.baseCtx, 'getImageData');
        service[selectArea](drawService.baseCtx);
        expect(drawServiceSpy).toHaveBeenCalled();
    });

    it('selectArea should not call getImageData if the width and height are 0', () => {
        service[pathData] = [
            { x: 100, y: 100 },
            { x: 100, y: 100 },
            { x: 100, y: 100 },
            { x: 100, y: 100 },
        ];
        drawServiceSpy = spyOn(drawService.baseCtx, 'getImageData');
        service[selectArea](drawService.baseCtx);
        expect(drawServiceSpy).not.toHaveBeenCalled();
    });

    it('updateCanvasOnMove should call fillrect on the argument context', () => {
        drawServiceSpy = spyOn(drawService.baseCtx, 'fillRect');
        service[selectedArea] = drawService.baseCtx.getImageData(width, height, width, height);
        service[updateCanvasOnMove](drawService.baseCtx);
        expect(drawServiceSpy).toHaveBeenCalled();
    });

    it('confirmSelectionMove should call updateCanvasOnMove and putImageData on the basectx', () => {
        selectionSpy = spyOn<any>(service, 'updateCanvasOnMove');
        drawServiceSpy = spyOn(drawService.baseCtx, 'putImageData');
        service[pathData].push({ x: width, y: height });
        service[confirmSelectionMove]();
        expect(selectionSpy).toHaveBeenCalled();
        expect(drawServiceSpy).toHaveBeenCalled();
    });

    it('drawBorder should call lineTo and setlinedash', () => {
        drawServiceSpy = spyOn(drawService.baseCtx, 'lineTo');
        service[drawBorder](drawService.baseCtx);
        expect(drawServiceSpy).toHaveBeenCalled();
    });

    it('setTopLefthandler should push the first coordinate of the PathData', () => {
        service[setTopLeftHandler]();
        expect(service[pathData][Globals.BOTTOM_RIGHT_HANDLER]).toEqual(service[pathData][0]);
    });

    it('setTopLefthandler should set the path with the new calculated topLeftHandler has the first element of the path', () => {
        service[pathData] = [
            { x: 200, y: 200 },
            { x: 200, y: 100 },
            { x: 100, y: 100 },
            { x: 100, y: 200 },
        ];
        service[setTopLeftHandler]();
        expect(service[pathData][0]).toEqual({ x: 100, y: 100 });
        expect(service[pathData][2]).toEqual({ x: 200, y: 200 });

        service[pathData] = [
            { x: 100, y: 200 },
            { x: 200, y: 200 },
            { x: 200, y: 100 },
            { x: 100, y: 100 },
        ];
        service[setTopLeftHandler]();
        expect(service[pathData][0]).toEqual({ x: 100, y: 100 });
        expect(service[pathData][2]).toEqual({ x: 200, y: 200 });

        service[pathData] = [
            { x: 200, y: 100 },
            { x: 200, y: 200 },
            { x: 100, y: 200 },
            { x: 100, y: 100 },
        ];
        service[setTopLeftHandler]();
        expect(service[pathData][0]).toEqual({ x: 100, y: 100 });
        expect(service[pathData][2]).toEqual({ x: 200, y: 200 });
    });
});
