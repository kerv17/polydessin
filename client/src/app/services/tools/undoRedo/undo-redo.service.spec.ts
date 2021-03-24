import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { CanvasAction, DrawAction, DrawingAction, UndoRedoService } from './undo-redo.service';
// tslint:disable:no-any
describe('UndoRedoService', () => {
    let service: UndoRedoService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let resizePointSpy: jasmine.SpyObj<ResizePoint>;
    let baseCtx: jasmine.SpyObj<CanvasRenderingContext2D>;
    let testTool: PencilService;
    let toolAction: DrawAction;
    let drawingAction: DrawingAction;
    const amountOfActionsToAdd = 25;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['resetCanvas', 'initializeCanvas', 'setCanvassSize', 'clearCanvas']);
        baseCtx = jasmine.createSpyObj('CanvasRenderingContext2D', ['putImageData']);
        drawingServiceSpy.baseCtx = baseCtx;
        resizePointSpy = jasmine.createSpyObj('RezisePoint', ['resetControlPoints']);
        drawingServiceSpy.resizePoint = resizePointSpy;
        testTool = new PencilService(drawingServiceSpy);

        drawingAction = {
            type: 'Drawing',
            // tslint:disable-next-line: no-magic-numbers
            drawing: new ImageData(10, 10),
            width: 10,
            height: 10,
        };
        (testTool as any).pathData = [
            { x: 5, y: 5 },
            { x: 50, y: 5 },
            { x: 5, y: 50 },
        ];
        toolAction = (testTool as any).createAction();

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        service = TestBed.inject(UndoRedoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service.pile.length).toEqual(1);
        expect(service.currentLocation).toEqual(0);
    });

    it('addAction is called when an action is dispatched', () => {
        const spy = spyOn(service, 'addAction');
        dispatchEvent(new CustomEvent('action', { detail: toolAction }));
        expect(spy).toHaveBeenCalledWith(toolAction);
    });

    it('addAction adds an action to the end of the pile', () => {
        service.addAction(toolAction);
        expect(service.currentLocation).toEqual(1);
        expect(service.pile).toEqual([{} as CanvasAction, toolAction as CanvasAction]);
    });

    it('addAction truncates the pile to the current location before adding an Action', () => {
        for (let i = 0; i < amountOfActionsToAdd; i++) {
            service.addAction(toolAction);
        }
        expect(service.pile.length).toEqual(amountOfActionsToAdd + 1);
        expect(service.currentLocation).toEqual(amountOfActionsToAdd);
        service.currentLocation = 0;
        service.addAction(toolAction);
        expect(service.currentLocation).toEqual(1);
        expect(service.pile).toEqual([{} as CanvasAction, toolAction as CanvasAction]);
    });

    it('sending an undoRedoWipe event should call resetPile', () => {
        const spy = spyOn(service, 'resetPile');
        const event = new CustomEvent('undoRedoWipe', { detail: drawingAction });
        dispatchEvent(event);
        expect(spy).toHaveBeenCalledWith(drawingAction);
    });

    it('sending an undoRedoWipe event should call resetPile', () => {
        const spy = spyOn(service, 'resetPile');
        const event = new CustomEvent('undoRedoWipe', { detail: drawingAction });
        dispatchEvent(event);
        expect(spy).toHaveBeenCalledWith(drawingAction);
    });

    it('resetPile resets the pile with the drawingAction passed', () => {
        service.addAction(toolAction);
        expect(service.currentLocation).toEqual(1);
        expect(service.pile).toEqual([{} as CanvasAction, toolAction as CanvasAction]);
        service.resetPile(drawingAction);
        expect(service.pile).toEqual([drawingAction]);
        expect(service.currentLocation).toEqual(0);
    });

    it('undo does all the actions of the pile up until the currentlocation', () => {
        for (let i = 0; i < amountOfActionsToAdd; i++) {
            service.addAction(toolAction);
        }
        const spy = spyOn(service, 'doAction');

        service.undo();

        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawingServiceSpy.setCanvassSize).toHaveBeenCalled();
        expect(drawingServiceSpy.initializeCanvas).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(amountOfActionsToAdd);
        expect(service.currentLocation).toEqual(amountOfActionsToAdd - 1);
    });

    it('undo doesnt do anything if current location is 0', () => {
        service.currentLocation = 0;
        service.undo();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawingServiceSpy.setCanvassSize).not.toHaveBeenCalled();
        expect(drawingServiceSpy.initializeCanvas).not.toHaveBeenCalled();
    });

    it('redo does the next action of the pile', () => {
        for (let i = 0; i < amountOfActionsToAdd; i++) {
            service.addAction(toolAction);
        }
        const spy = spyOn(service, 'doAction');
        service.currentLocation = 0;
        service.redo();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(service.currentLocation).toEqual(1);
    });

    it('redo doesnt do anything if current location isnt smaller than the length of pile', () => {
        for (let i = 0; i < amountOfActionsToAdd; i++) {
            service.addAction(toolAction);
        }
        const spy = spyOn(service, 'doAction');
        service.redo();

        expect(spy).toHaveBeenCalledTimes(0);
        expect(service.currentLocation).toEqual(amountOfActionsToAdd);
    });

    it('doAction calls the right action type', () => {
        const toolSpy = spyOn<any>(testTool, 'doAction');
        service.doAction(toolAction);
        expect(toolSpy).toHaveBeenCalled();

        service.doAction(drawingAction);
        expect(drawingServiceSpy.resizePoint.resetControlPoints).toHaveBeenCalled();
        expect(drawingServiceSpy.resetCanvas).toHaveBeenCalled();
        expect(drawingServiceSpy.baseCtx.putImageData).toHaveBeenCalled();
    });

    it('doAction does nothing if the CanvasAction cannot recognise the type', () => {
        toolAction.type = 'Anything';
        service.doAction(toolAction);

        expect(drawingServiceSpy.resizePoint.resetControlPoints).not.toHaveBeenCalled();
        expect(drawingServiceSpy.resetCanvas).not.toHaveBeenCalled();
        expect(drawingServiceSpy.baseCtx.putImageData).not.toHaveBeenCalled();
    });

    it('sendUndoButtonState', () => {
        let result: boolean[] = [];
        addEventListener('undoRedoState', (event: CustomEvent) => {
            result = event.detail;
        });

        for (let i = 0; i < amountOfActionsToAdd; i++) {
            service.addAction(toolAction);
        }
        service.currentLocation = 0;
        service.sendUndoButtonState();
        expect(result).toEqual([false, true]);

        service.currentLocation = 2;
        service.sendUndoButtonState();
        expect(result).toEqual([true, true]);

        service.currentLocation = amountOfActionsToAdd + 2;
        service.sendUndoButtonState();
        expect(result).toEqual([true, false]);
    });
});
