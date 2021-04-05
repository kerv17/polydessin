import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { SelectionBoxService } from './selection-box.service';

describe('SelectionBoxService', () => {
    let service: SelectionBoxService;
    let topLeft: Vec2;
    const width = 100;
    const height = 100;
    const size = 8;
    let mouseEvent: MouseEvent;
    const handlersPosition = 'handlersPositions';

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionBoxService);
        mouseEvent = Globals.mouseDownEvent;
        topLeft = { x: 100, y: 100 };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setHandlersPosition should add the correct position values to the handlersPosition array', () => {
        service.setHandlersPositions(topLeft, width, height);
        expect(service[handlersPosition].length).toEqual(size);
        expect(service[handlersPosition][Globals.TOP_LEFT_HANDLER]).toEqual(topLeft);
        expect(service[handlersPosition][Globals.TOP_HANDLER]).toEqual({ x: 150, y: 100 });
        expect(service[handlersPosition][Globals.TOP_RIGHT_HANDLER]).toEqual({ x: 200, y: 100 });
        expect(service[handlersPosition][Globals.RIGHT_HANDLER]).toEqual({ x: 200, y: 150 });
        expect(service[handlersPosition][Globals.BOTTOM_RIGHT_HANDLER]).toEqual({ x: 200, y: 200 });
        expect(service[handlersPosition][Globals.BOTTOM_HANDLER]).toEqual({ x: 150, y: 200 });
        expect(service[handlersPosition][Globals.BOTTOM_LEFT_HANDLER]).toEqual({ x: 100, y: 200 });
        expect(service[handlersPosition][Globals.LEFT_HANDLER]).toEqual({ x: 100, y: 150 });
    });

    it('setHandlersPosition should replace the previous handlersPosition array with the new values', () => {
        const largeWidth = 500;
        service.setHandlersPositions({ x: 0, y: 0 }, largeWidth, largeWidth);
        service.setHandlersPositions(topLeft, width, height);
        expect(service[handlersPosition].length).toEqual(size);
        expect(service[handlersPosition][Globals.TOP_LEFT_HANDLER]).toEqual(topLeft);
        expect(service[handlersPosition][Globals.TOP_HANDLER]).toEqual({ x: 150, y: 100 });
        expect(service[handlersPosition][Globals.TOP_RIGHT_HANDLER]).toEqual({ x: 200, y: 100 });
        expect(service[handlersPosition][Globals.RIGHT_HANDLER]).toEqual({ x: 200, y: 150 });
        expect(service[handlersPosition][Globals.BOTTOM_RIGHT_HANDLER]).toEqual({ x: 200, y: 200 });
        expect(service[handlersPosition][Globals.BOTTOM_HANDLER]).toEqual({ x: 150, y: 200 });
        expect(service[handlersPosition][Globals.BOTTOM_LEFT_HANDLER]).toEqual({ x: 100, y: 200 });
        expect(service[handlersPosition][Globals.LEFT_HANDLER]).toEqual({ x: 100, y: 150 });
    });

    it('getHandlersPositions should return the current handlersPositions array', () => {
        service.setHandlersPositions(topLeft, width, height);
        expect(service.getHandlersPositions()).toEqual(service[handlersPosition]);
    });

    it('getCursor should return the value of the setCursor method based on the position of the mouse', () => {
        const expectedPos = 10;
        expect(service.getCursor(mouseEvent)).toEqual(service.setCursor(expectedPos));
    });

    it('setCursor should return all-scroll if the cursor is not on one of the 8 handlers', () => {
        const pos = 12;
        expect(service.setCursor(pos)).toEqual('all-scroll');
    });

    it('setCursor should return nw-resize if the cursor is on the top left or bottom right handler', () => {
        expect(service.setCursor(Globals.TOP_LEFT_HANDLER)).toEqual('nw-resize');
        expect(service.setCursor(Globals.BOTTOM_RIGHT_HANDLER)).toEqual('nw-resize');
    });

    it('setCursor should return n-resize if the cursor is on the top or bottom handler', () => {
        expect(service.setCursor(Globals.TOP_HANDLER)).toEqual('n-resize');
        expect(service.setCursor(Globals.BOTTOM_HANDLER)).toEqual('n-resize');
    });

    it('setCursor should return ne-resize if the cursor is on the top right or bottom left handler', () => {
        expect(service.setCursor(Globals.TOP_RIGHT_HANDLER)).toEqual('ne-resize');
        expect(service.setCursor(Globals.BOTTOM_LEFT_HANDLER)).toEqual('ne-resize');
    });

    it('setCursor should return e-resize if the cursor is on the right or left handler', () => {
        expect(service.setCursor(Globals.RIGHT_HANDLER)).toEqual('e-resize');
        expect(service.setCursor(Globals.LEFT_HANDLER)).toEqual('e-resize');
    });

    it('getLeftPosition should return a string with the x value of the corresponding handler', () => {
        service.setHandlersPositions({ x: width, y: height }, width, height);
        expect(service.getLeftPosition(Globals.BOTTOM_RIGHT_HANDLER)).toEqual('195px');
        expect(service.getLeftPosition(Globals.TOP_LEFT_HANDLER)).toEqual('95px');
    });

    it('getTopPosition should return a string with the y value of the corresponding handler', () => {
        service.setHandlersPositions({ x: width, y: height }, width, height);
        expect(service.getTopPosition(Globals.BOTTOM_RIGHT_HANDLER)).toEqual('195px');
        expect(service.getTopPosition(Globals.TOP_LEFT_HANDLER)).toEqual('95px');
    });

    it('drawSelectionBox should set the selectionBox style with the correct position values', () => {
        service.drawSelectionBox({ x: width, y: height }, width, height);
        expect(service.selectionBox.height).toEqual('100px');
        expect(service.selectionBox.width).toEqual('100px');
        expect(service.selectionBox.height).toEqual('100px');
        expect(service.selectionBox.height).toEqual('100px');
    });

    it('cursorChange should call getCursor if the mouse is over the selection', () => {
        service.cursorChange(mouseEvent, true, { x: width, y: height }, width, height);
        expect(service.cursor.cursor).toEqual(service.getCursor(mouseEvent));
    });

    it('cursorChange should set the cursor to crosshair if the mouse is not over the selection', () => {
        const mouseEvent2 = {
            offsetX: 75,
            offsetY: 500,
            button: 1,
        } as MouseEvent;
        service.cursorChange(mouseEvent2, true, { x: width, y: height }, width, height);
        expect(service.cursor.cursor).toEqual('crosshair');
    });

    it('cursorChange should set the cursor to crosshair if we are not in selection', () => {
        service.cursorChange(mouseEvent, false, { x: width, y: height }, width, height);
        expect(service.cursor.cursor).toEqual('crosshair');
    });
});
