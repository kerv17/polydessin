import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionMovementService } from './selection-movement.service';

fdescribe('SelectionMovementService', () => {
    let service: SelectionMovementService;
    let drawService: DrawingService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    const topLeft = { x: 100, y: 100 };
    const width = 100;
    const height = 100;
    const mouseEvent = {
        offsetX: 125,
        offsetY: 125,
        x: 125,
        y: 125,
        button: 1,
    } as MouseEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionMovementService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown should set the initialMousePosition value based on the mouseEvent and return true if the selected area was clicked', () => {
        const mousePosition = { x: 125, y: 125 };
        const expectedResult = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
        expect(service.onMouseDown(mouseEvent, mousePosition, topLeft, width, height)).toBeTrue();
        expect(service.initialMousePosition).toEqual(expectedResult);
    });

    it('onMouseDown should return false if the the selected area was not clicked', () => {
        const mousePosition = { x: 75, y: 125 };
        const expectedResult = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
        expect(service.onMouseDown(mouseEvent, mousePosition, topLeft, width, height)).not.toBeTrue();
        expect(service.initialMousePosition).not.toEqual(expectedResult);

        const mousePosition2 = { x: 500, y: 500 };
        expect(service.onMouseDown(mouseEvent, mousePosition2, topLeft, width, height)).not.toBeTrue();
        expect(service.initialMousePosition).not.toEqual(expectedResult);
    });

    /*it('onMouseMove should move the selected area to its new position on the canvas', () => {
        // initialiser baseCtx????
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['baseCtx.putImageData']);
        drawService = TestBed.inject(DrawingService);
        const selectedArea = drawService.baseCtx.getImageData(0, 0, 1, 1);
        service.initialMousePosition = { x: 125, y: 125 };
        service.onMouseMove(mouseEvent, drawService.baseCtx, topLeft, selectedArea);
        expect(drawServiceSpy).toHaveBeenCalledWith(selectedArea);
    });

    it('onMouseUp should set initialMousePosition to 0,0 and return the new position', () => {});

    it('onMouseUp should push the new position to pathData', () => {});

    it('onMouseUp should pop the last element of pathData if there are already 5 values', () => {});

    it('onArrowKeyDown should set the boolean value corresponding to the key event if it occured while being in selection', () => {});

    it('onArrowKeyDown should not set the boolean value corresponding to the key event if it didn't occur while being in selection', () => {});

    it('', () => {});*/
});
