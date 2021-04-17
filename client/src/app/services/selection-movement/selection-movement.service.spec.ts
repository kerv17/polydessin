import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionMovementService } from './selection-movement.service';

// tslint:disable: no-any
describe('SelectionMovementService', () => {
    let service: SelectionMovementService;
    let drawService: DrawingService;
    let drawServiceSpy: jasmine.Spy;
    let canvasTestHelper: CanvasTestHelper;
    let selectionSpy: jasmine.Spy;
    const initialMousePosition = 'initialMousePosition';
    const leftArrow = 'leftArrow';
    const downArrow = 'downArrow';
    const rightArrow = 'rightArrow';
    const upArrow = 'upArrow';
    let topLeft: Vec2;
    const width = 100;
    const height = 100;
    let mouseEvent: MouseEvent;
    let pathData: Vec2[];
    let selectedArea: ImageData;
    // le but est ici d'avoir une imagedata non initialisée
    // tslint:disable-next-line: prefer-const
    let undefinedSelectedArea: ImageData;
    const keyDown = 'keyDown';
    const firstTime = 'firstTime';
    const setKeyMovementDelays = 'setKeyMovementDelays';
    const drawSelection = 'drawSelection';

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionMovementService);
        drawService = TestBed.inject(DrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawService.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawService.previewCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawService.canvas = canvasTestHelper.canvas;
        topLeft = { x: 100, y: 100 };
        mouseEvent = Globals.mouseDownEvent;
        pathData = [
            { x: 100, y: 100 },
            { x: 200, y: 100 },
            { x: 200, y: 200 },
            { x: 100, y: 200 },
        ];
        selectedArea = undefinedSelectedArea;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown should set the initialMousePosition value based on the mouseEvent and return true if the selected area was clicked', () => {
        const mousePosition = { x: 125, y: 125 };
        const expectedResult = { x: mouseEvent.x, y: mouseEvent.y };
        expect(service.onMouseDown(mouseEvent, mousePosition, topLeft, width, height)).toBeTrue();
        expect(service[initialMousePosition]).toEqual(expectedResult);
    });

    it('onMouseDown should return false if the the selected area was not clicked', () => {
        const mousePosition = { x: 75, y: 125 };
        const expectedResult = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
        expect(service.onMouseDown(mouseEvent, mousePosition, topLeft, width, height)).not.toBeTrue();
        expect(service[initialMousePosition]).not.toEqual(expectedResult);

        const mousePosition2 = { x: 500, y: 500 };
        expect(service.onMouseDown(mouseEvent, mousePosition2, topLeft, width, height)).not.toBeTrue();
        expect(service[initialMousePosition]).not.toEqual(expectedResult);
    });

    it('onMouseMove should move the selected area to its new position on the canvas', () => {
        drawServiceSpy = spyOn(drawService.baseCtx, 'putImageData');
        selectedArea = drawService.baseCtx.getImageData(0, 0, drawService.canvas.width, drawService.canvas.height);
        service[initialMousePosition] = { x: 125, y: 125 };
        service.onMouseMove(mouseEvent, drawService.baseCtx, topLeft, selectedArea);
        expect(drawServiceSpy).toHaveBeenCalledWith(selectedArea, width, height);
    });

    it('onMouseUp should set initialMousePosition to 0,0 and return the new position', () => {
        const path: Vec2[] = [];
        service[initialMousePosition] = { x: 125, y: 125 };
        expect(service.onMouseUp(mouseEvent, topLeft, path)).toEqual(topLeft);
        expect(service[initialMousePosition]).toEqual({ x: 0, y: 0 });
    });

    it('onMouseUp should push the new position to pathData', () => {
        const path: Vec2[] = [];
        service[initialMousePosition] = { x: 125, y: 125 };
        service.onMouseUp(mouseEvent, topLeft, path);
        expect(path.length).toEqual(1);
        expect(path[0]).toEqual(topLeft);
    });

    it('onMouseUp should pop the last element of pathData if there are already 5 values', () => {
        const deplacement = 15;
        const expectedLength = 5;
        const path: Vec2[] = [
            { x: 100, y: 100 },
            { x: 200, y: 100 },
            { x: 200, y: 200 },
            { x: 100, y: 200 },
            { x: 100, y: 100 },
        ];
        service[initialMousePosition] = { x: 110, y: 110 };
        const expectedResult = { x: topLeft.x + deplacement, y: topLeft.y + deplacement };
        service.onMouseUp(mouseEvent, topLeft, path);
        expect(path.length).toEqual(expectedLength);
        expect(path[path.length - 1]).toEqual(expectedResult);
    });

    it('isArrowKeyDown should return true if the key pressed is an arrow', () => {
        const keyEventArrowLeft = {
            key: 'ArrowLeft',
        } as KeyboardEvent;

        expect(service.isArrowKeyDown(keyEventArrowLeft)).toBeTrue();
    });

    it('isArrowKeyDown should return false if the key pressed is not an arrow', () => {
        const keyEvent = {
            key: '22',
        } as KeyboardEvent;

        expect(service.isArrowKeyDown(keyEvent)).not.toBeTrue();
    });

    it('isArrowKeyDown should set ArrowUp to true if it occured while being in selection', () => {
        const keyEventArrowUp = {
            key: 'ArrowUp',
        } as KeyboardEvent;
        service.isArrowKeyDown(keyEventArrowUp);
        expect(service[leftArrow]).not.toBeTrue();
        expect(service[upArrow]).toBeTrue();
        expect(service[rightArrow]).not.toBeTrue();
        expect(service[downArrow]).not.toBeTrue();
    });

    it('isArrowKeyDown should set ArrowRight to true if it occured while being in selection', () => {
        const keyEventArrowRight = {
            key: 'ArrowRight',
        } as KeyboardEvent;
        service.isArrowKeyDown(keyEventArrowRight);
        expect(service[leftArrow]).not.toBeTrue();
        expect(service[upArrow]).not.toBeTrue();
        expect(service[rightArrow]).toBeTrue();
        expect(service[downArrow]).not.toBeTrue();
    });

    it('isArrowKeyDown should set ArrowDown to true if it occured while being in selection', () => {
        const keyEventArrowDown = {
            key: 'ArrowDown',
        } as KeyboardEvent;
        service.isArrowKeyDown(keyEventArrowDown);
        expect(service[leftArrow]).not.toBeTrue();
        expect(service[upArrow]).not.toBeTrue();
        expect(service[rightArrow]).not.toBeTrue();
        expect(service[downArrow]).toBeTrue();
    });

    it('isArrowKeyDown should not set any arrow boolean value to true if it was not an arrow key that was pressed', () => {
        const keyEvent = {
            key: '12',
        } as KeyboardEvent;
        service.isArrowKeyDown(keyEvent);
        expect(service[leftArrow]).not.toBeTrue();
        expect(service[upArrow]).not.toBeTrue();
        expect(service[rightArrow]).not.toBeTrue();
        expect(service[downArrow]).not.toBeTrue();
    });

    it('onArrowKeyUp should set the corresponding boolean value to false when a key is up and while inSelection', () => {
        const keyEventArrowLeft = {
            key: 'ArrowLeft',
        } as KeyboardEvent;
        service[leftArrow] = true;
        service.onArrowKeyUp(keyEventArrowLeft);
        expect(service[leftArrow]).not.toBeTrue();

        const keyEventArrowUp = {
            key: 'ArrowUp',
        } as KeyboardEvent;
        service[upArrow] = true;
        service.onArrowKeyUp(keyEventArrowUp);
        expect(service[upArrow]).not.toBeTrue();

        const keyEventArrowRight = {
            key: 'ArrowRight',
        } as KeyboardEvent;
        service[rightArrow] = true;
        service.onArrowKeyUp(keyEventArrowRight);
        expect(service[rightArrow]).not.toBeTrue();

        const keyEventArrowDown = {
            key: 'ArrowDown',
        } as KeyboardEvent;
        service[downArrow] = true;
        service.onArrowKeyUp(keyEventArrowDown);
        expect(service[downArrow]).not.toBeTrue();
    });

    it('moveSelection should add the current topLeft position to the path based on which key is down if path length was 4', () => {
        const path: Vec2[] = [
            { x: 100, y: 100 },
            { x: 200, y: 100 },
            { x: 200, y: 200 },
            { x: 100, y: 200 },
        ];
        service[leftArrow] = true;
        let expectedresult = { x: path[0].x - Globals.PIXELS_MOVE_SELECTION, y: topLeft.y };
        (service as any).moveSelection(path);
        expect(path[Globals.CURRENT_SELECTION_POSITION]).toEqual(expectedresult);

        service[leftArrow] = false;
        service[upArrow] = true;
        service[rightArrow] = true;
        expectedresult = { x: expectedresult.x + Globals.PIXELS_MOVE_SELECTION, y: expectedresult.y - Globals.PIXELS_MOVE_SELECTION };
        (service as any).moveSelection(path);
        expect(path[Globals.CURRENT_SELECTION_POSITION]).toEqual(expectedresult);
    });

    it('moveSelection should update the current topLeft position to the path based on which key is down if path lenth was 5', () => {
        const expectedLength = 5;
        const path: Vec2[] = [
            { x: 100, y: 100 },
            { x: 200, y: 100 },
            { x: 200, y: 200 },
            { x: 100, y: 200 },
            { x: 103, y: 103 },
        ];
        service[downArrow] = true;
        let expectedresult = {
            x: path[Globals.CURRENT_SELECTION_POSITION].x,
            y: path[Globals.CURRENT_SELECTION_POSITION].y + Globals.PIXELS_MOVE_SELECTION,
        };
        (service as any).moveSelection(path);
        expect(path[Globals.CURRENT_SELECTION_POSITION]).toEqual(expectedresult);
        expect(path.length).toEqual(expectedLength);

        service[leftArrow] = false;
        service[upArrow] = true;
        service[rightArrow] = true;
        service[downArrow] = false;
        expectedresult = { x: expectedresult.x + Globals.PIXELS_MOVE_SELECTION, y: expectedresult.y - Globals.PIXELS_MOVE_SELECTION };
        (service as any).moveSelection(path);
        expect(path[Globals.CURRENT_SELECTION_POSITION]).toEqual(expectedresult);
        expect(path.length).toEqual(expectedLength);
    });

    it('updateCanvasOnMove should call fillrect on the argument context', () => {
        drawServiceSpy = spyOn(drawService.baseCtx, 'fillRect');
        service.updateCanvasOnMove(drawService.baseCtx, pathData);
        expect(drawServiceSpy).toHaveBeenCalled();
    });

    it('onArrowDown should call setKeyMovementDelays if repeated is true', () => {
        selectionSpy = spyOn<any>(service, 'setKeyMovementDelays');
        selectedArea = drawService.baseCtx.getImageData(width, height, width, height);
        service.onArrowDown(true, selectedArea, pathData);
        expect(selectionSpy).toHaveBeenCalled();
    });

    it('onArrowDown should call drawSelection if repeated is false', () => {
        selectionSpy = spyOn<any>(service, 'drawSelection');
        selectedArea = drawService.baseCtx.getImageData(width, height, width, height);
        service.onArrowDown(false, selectedArea, pathData);
        expect(selectionSpy).toHaveBeenCalled();
    });

    it('setKeyMovementDelays should call setTimeout if keyDown is false', () => {
        service[keyDown] = false;
        jasmine.clock().install();
        selectedArea = drawService.baseCtx.getImageData(width, height, width, height);
        service[setKeyMovementDelays](selectedArea, pathData);
        jasmine.clock().tick(Globals.TIMEOUT_MS + 1);
        expect(service[keyDown]).toBeTrue();
        jasmine.clock().uninstall();
    });

    it('setKeyMovementDelays should call setInterval if keyDown is true and firstTime is true', () => {
        service[keyDown] = true;
        service[firstTime] = true;
        selectionSpy = spyOn<any>(service, 'drawSelection');
        jasmine.clock().install();
        selectedArea = drawService.baseCtx.getImageData(width, height, width, height);
        service[setKeyMovementDelays](selectedArea, pathData);
        jasmine.clock().tick(Globals.INTERVAL_MS + 1);
        expect(service[firstTime]).not.toBeTrue();
        expect(selectionSpy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('setKeyMovementDelays should not call setInterval if keyDown is true and firstTime is false', () => {
        service[keyDown] = true;
        service[firstTime] = false;
        selectionSpy = spyOn<any>(service, 'drawSelection');
        selectedArea = drawService.baseCtx.getImageData(width, height, width, height);
        service[setKeyMovementDelays](selectedArea, pathData);
        expect(service[firstTime]).not.toBeTrue();
        expect(selectionSpy).not.toHaveBeenCalled();
    });

    it('drawSelection should call moveSelection, clearCanvas, updateCanvasOnMove and putImageData if ImageData is not undefined', () => {
        const moveSpy = spyOn(service as any, 'moveSelection');
        selectionSpy = spyOn(service, 'updateCanvasOnMove');
        drawServiceSpy = spyOn(drawService, 'clearCanvas');
        pathData.push({ x: width, y: height });
        selectedArea = drawService.baseCtx.getImageData(width, height, width, height);
        service[drawSelection](selectedArea, pathData);
        expect(moveSpy).toHaveBeenCalled();
        expect(selectionSpy).toHaveBeenCalled();
        expect(drawServiceSpy).toHaveBeenCalled();
    });

    it('drawSelection should not call moveSelection, clearCanvas, updateCanvasOnMove and putImageData if ImageData is undefined', () => {
        const selectionMovementSpy = spyOn(service as any, 'moveSelection');
        selectionSpy = spyOn(service, 'updateCanvasOnMove');
        drawServiceSpy = spyOn(drawService, 'clearCanvas');
        pathData.push({ x: width, y: height });
        service[drawSelection](selectedArea, pathData);
        expect(selectionMovementSpy).not.toHaveBeenCalled();
        expect(selectionSpy).not.toHaveBeenCalled();
        expect(drawServiceSpy).not.toHaveBeenCalled();
    });
});
