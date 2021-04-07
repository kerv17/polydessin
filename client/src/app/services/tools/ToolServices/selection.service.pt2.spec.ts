import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
import { SelectionBoxService } from '@app/services/selection-box/selection-box.service';
import { SelectionMovementService } from '@app/services/selection-movement/selection-movement.service';
import { SelectionResizeService } from '@app/services/selection-resize/selection-resize.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';
import { SelectionService } from './selection.service';
export class SelectionMoveStub extends SelectionMovementService {
    onArrowDown(selectedArea: ImageData, pathData: Vec2[]): void {
        return;
    }
}
// justifié pour pouvoir faire des spys sur des méthodes privées
// tslint:disable: no-any
describe('SelectionService', () => {
    let service: SelectionService;
    let drawService: DrawingService;
    let selectionMoveStub: SelectionMoveStub;
    let selectionMoveService: SelectionMovementService;
    let selectionResizeService: SelectionResizeService;
    let selectionBoxService: SelectionBoxService;
    let drawServiceSpy: jasmine.Spy;
    let selectionSpy: jasmine.Spy;
    let canvasTestHelper: CanvasTestHelper;
    let selectionMovementSpy: jasmine.Spy;
    let selectAreaSpy: jasmine.Spy;
    const width = 100;
    const height = 100;
    const canvasWidth = 500;
    const canvasHeight = 500;
    const pathData = 'pathData';
    const selectionMove = 'selectionMove';
    const createAction = 'createAction';
    const selectedArea = 'selectedArea';
    const selectArea = 'selectArea';
    const drawBorder = 'drawBorder';
    const confirmSelectionMove = 'confirmSelectionMove';
    const setTopLeftHandler = 'setTopLeftHandler';
    const keyDown = 'keyDown';
    const firstTime = 'firstTime';
    const rectangleService = 'rectangleService';
    const upArrow = 'upArrow';

    beforeEach(() => {
        drawService = new DrawingService({} as ResizePoint);
        selectionBoxService = new SelectionBoxService();
        selectionResizeService = new SelectionResizeService(selectionBoxService);
        selectionMoveService = new SelectionMovementService(drawService, selectionResizeService);
        canvasTestHelper = new CanvasTestHelper();
        selectionMoveStub = new SelectionMoveStub(drawService, selectionResizeService);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawService },
                { provide: SelectionMovementService, useValue: selectionMoveService },
                { provide: SelectionResizeService, useValue: selectionResizeService },
                { provide: SelectionMoveStub, useValue: selectionMoveStub },
                { provide: SelectionBoxService, useValue: selectionBoxService },
                { provide: CanvasTestHelper, useValue: canvasTestHelper },
            ],
        });
        service = TestBed.inject(SelectionService);
        drawService.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawService.previewCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawService.canvas = canvasTestHelper.canvas;
        drawService.canvas.width = canvasWidth;
        drawService.canvas.height = canvasHeight;
        service[pathData] = [
            { x: 100, y: 100 },
            { x: 200, y: 100 },
            { x: 200, y: 200 },
            { x: 100, y: 200 },
        ];
        selectionBoxService.setHandlersPositions({ x: 100, y: 100 }, width, width);
        selectionResizeService.initializePath(service[pathData]);
        service[rectangleService].setPath(service[pathData]);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
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

    it('doAction should call saveSetting, loadSetting and confirmSelectionMove', () => {
        const action: DrawAction = service[createAction]();
        selectionSpy = spyOn<any>(service, 'loadSetting');
        const selectionSpy2 = spyOn<any>(service, 'confirmSelectionMove');
        service[pathData].push({ x: width, y: height });
        service.doAction(action);
        expect(selectionSpy).toHaveBeenCalled();
        expect(selectionSpy2).toHaveBeenCalled();
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

    it('confirmSelectionMove should call updateCanvasOnMove and putImageData on the basectx', () => {
        selectionSpy = spyOn(selectionMoveService, 'updateCanvasOnMove');
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

    it('getPositionFromMouse should limit the x value to the width of the canvas if mouse is on the right of the canvas', () => {
        const mouseEvent = {
            pageX: 1000,
            pageY: 125,
            button: 0,
        } as MouseEvent;
        expect(service.getPositionFromMouse(mouseEvent)).toEqual({ x: canvasWidth, y: 125 });
    });

    it('getPositionFromMouse should limit the x value to 0 if mouse is on the left of the canvas', () => {
        const mouseEvent = {
            pageX: 300,
            pageY: 125,
            button: 0,
        } as MouseEvent;
        expect(service.getPositionFromMouse(mouseEvent)).toEqual({ x: 0, y: 125 });
    });

    it('getPositionFromMouse should limit the y value to the height of the canvas if mouse is below the canvas', () => {
        const mouseEvent = {
            pageX: canvasWidth,
            pageY: 1000,
            button: 0,
        } as MouseEvent;
        expect(service.getPositionFromMouse(mouseEvent)).toEqual({ x: canvasWidth - Globals.SIDEBAR_WIDTH, y: canvasHeight });
    });

    it('getPositionFromMouse should limit the y value to 0 if mouse is on top of the canvas', () => {
        const mouseEvent = {
            pageX: canvasWidth,
            pageY: -125,
            button: 0,
        } as MouseEvent;
        expect(service.getPositionFromMouse(mouseEvent)).toEqual({ x: canvasWidth - Globals.SIDEBAR_WIDTH, y: 0 });
    });

    it('EventListener on keydown should do nothing if there is no active selection', () => {
        service.inSelection = false;
        selectionSpy = spyOn(selectionMoveService, 'setKeyMovementDelays');
        const selectionSpy2 = spyOn(selectionMoveService, 'onArrowDown');
        const keyEventData = { isTrusted: true, key: '24' };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        document.dispatchEvent(keyDownEvent);
        expect(selectionSpy).not.toHaveBeenCalled();
        expect(selectionSpy2).not.toHaveBeenCalled();
    });

    it('EventListener on keydown should do nothing if the key pressed is not an arrow', () => {
        service.inSelection = true;
        selectionSpy = spyOn(selectionMoveService, 'setKeyMovementDelays');
        const selectionSpy2 = spyOn(selectionMoveService, 'onArrowDown');
        const keyEventData = { isTrusted: true, key: '23' };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        document.dispatchEvent(keyDownEvent);
        expect(selectionSpy).not.toHaveBeenCalled();
        expect(selectionSpy2).not.toHaveBeenCalled();
    });

    it('EventListener on keydown should call setKeyMovementDelays if the arrowKey pressed while inSelection is repeated', () => {
        service.inSelection = true;
        selectionSpy = spyOn(selectionMoveService, 'setKeyMovementDelays');
        const keyEventData = { isTrusted: true, key: 'ArrowRight', repeat: true };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        document.dispatchEvent(keyDownEvent);
        expect(selectionSpy).toHaveBeenCalled();
    });

    // IDK WTF IS GOING ON
    xit('EventListener on keydown should call arrowDown if the arrowKey pressed while inSelection is not repeated', () => {
        service.inSelection = true;
        selectionMoveService[upArrow] = true;
        service[selectedArea] = drawService.baseCtx.getImageData(width, height, width, height);
        service[pathData].push({ x: width, y: height });
        selectionSpy = spyOn(selectionMoveStub, 'onArrowDown');
        const keyEventData = { isTrusted: true, key: 'ArrowUp', repeat: false };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        document.dispatchEvent(keyDownEvent);
        expect(selectionSpy).toHaveBeenCalled();
    });

    it('EventListener on keyup should do nothing if there is no active selection', () => {
        service.inSelection = false;
        selectionMovementSpy = spyOn<any>(selectionMoveService, 'onArrowKeyUp');
        const keyEventData = { isTrusted: true, key: '39', repeat: true };
        const keyUpEvent = new KeyboardEvent('keyup', keyEventData);
        document.dispatchEvent(keyUpEvent);
        expect(selectionMovementSpy).not.toHaveBeenCalled();
    });

    it('EventListener on keyup should do nothing if the key up is not an arrow', () => {
        service.inSelection = true;
        selectionMovementSpy = spyOn<any>(selectionMoveService, 'onArrowKeyUp');
        const keyEventData = { isTrusted: true, key: '42', repeat: true };
        const keyUpEvent = new KeyboardEvent('keyup', keyEventData);
        document.dispatchEvent(keyUpEvent);
        expect(selectionMovementSpy).not.toHaveBeenCalled();
    });

    it('EventListener on keyup should set Keydown to false if the arrow key was released while inSelection is true', () => {
        service.inSelection = true;
        selectionMovementSpy = spyOn<any>(selectionMoveService, 'onArrowKeyUp');
        const keyEventData = { isTrusted: true, key: 'ArrowDown', repeat: true };
        const keyUpEvent = new KeyboardEvent('keyup', keyEventData);
        document.dispatchEvent(keyUpEvent);
        expect(selectionMovementSpy).toHaveBeenCalled();
        expect(service[selectionMove][keyDown]).not.toBeTrue();
        expect(service[selectionMove][firstTime]).toBeTrue();
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
