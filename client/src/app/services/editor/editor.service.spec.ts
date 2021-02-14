import { TestBed } from '@angular/core/testing';
import { EditorService } from './editor.service';

// tslint: disable: no - any;
describe('EditorService', () => {
    let service: EditorService;
    let setResizerBottomLineSpy: jasmine.Spy;
    let setResizerRightLineSpy: jasmine.Spy;
    let setResizerBottomRightSpy: jasmine.Spy;
    let mouseEvent: MouseEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EditorService);
        mouseEvent = {
            offsetX: 50,
            offsetY: 50,
            button: 0,
        } as MouseEvent;
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('resetControlPoints should call setResizers', () => {
        const entree = 40;
        setResizerBottomLineSpy = spyOn(service, 'setResizerBottomLine');
        setResizerRightLineSpy = spyOn(service, 'setResizerRightLine');
        setResizerBottomRightSpy = spyOn(service, 'setResizerBottomRight');
        service.resetControlPoints(entree, entree);
        expect(setResizerBottomLineSpy).toHaveBeenCalled();
        expect(setResizerRightLineSpy).toHaveBeenCalled();
        expect(setResizerBottomRightSpy).toHaveBeenCalled();
    });
    it('resetControlPoints should assign value to posX and posY', () => {
        const expectedResultX = 1000;
        const expectedResultY = 1000;
        service.resetControlPoints(expectedResultX, expectedResultY);
        expect(service.posX).toEqual(expectedResultX);
        expect(service.posY).toEqual(expectedResultY);
    });
    it('setResizerRightLine should set right line control point', () => {
        const entreeX = 1000;
        const entreeY = 700;
        const expectedWidth = '997.5px';
        const expectedHeight = '350px';
        const expectedCursor = 'col-resize';
        let expectedNGStyle: { [key: string]: string };
        expectedNGStyle = {
            ['cursor']: expectedCursor,
            'margin-left': expectedWidth,
            'margin-top': expectedHeight,
        };
        service.posX = entreeX;
        service.posY = entreeY;
        service.setResizerRightLine();
        expect(service.resizerRightLine).toEqual(expectedNGStyle);
    });
    it('setResizerBottomLine should set bottom line control point', () => {
        const entreeX = 1000;
        const entreeY = 700;
        const expectedWidth = '500px';
        const expectedHeight = '697.5px';
        const expectedCursor = 'row-resize';
        let expectedNGStyle: { [key: string]: string };
        expectedNGStyle = {
            ['cursor']: expectedCursor,
            'margin-left': expectedWidth,
            'margin-top': expectedHeight,
        };
        service.posX = entreeX;
        service.posY = entreeY;
        service.setResizerBottomLine();
        expect(service.resizerBottomLine).toEqual(expectedNGStyle);
    });
    it('setResizerBottomRight should set bottom right control point', () => {
        const entreeX = 1000;
        const entreeY = 700;
        const expectedWidth = '997.5px';
        const expectedHeight = '697.5px';
        const expectedCursor = 'nwse-resize';
        let expectedNGStyle: { [key: string]: string };
        expectedNGStyle = {
            ['cursor']: expectedCursor,
            'margin-left': expectedWidth,
            'margin-top': expectedHeight,
        };
        service.posX = entreeX;
        service.posY = entreeY;
        service.setResizerBottomRight();
        expect(service.resizerBottomRight).toEqual(expectedNGStyle);
    });
    it('mouseMoveHandlerRight should do nothing if mousedown is false', () => {
        service.mouseDown = false;
        setResizerRightLineSpy = spyOn(service, 'setResizerRightLine');
        setResizerBottomLineSpy = spyOn(service, 'setResizerBottomLine');
        setResizerBottomRightSpy = spyOn(service, 'setResizerBottomRight');
        service.mouseMoveHandlerRight(mouseEvent);
        expect(setResizerBottomLineSpy).not.toHaveBeenCalled();
        expect(setResizerRightLineSpy).not.toHaveBeenCalled();
        expect(setResizerBottomRightSpy).not.toHaveBeenCalled();
    });
    it('mouseMoveHandlerRight should call the setResizers if mousedown is true', () => {
        service.mouseDown = true;
        setResizerRightLineSpy = spyOn(service, 'setResizerRightLine');
        setResizerBottomLineSpy = spyOn(service, 'setResizerBottomLine');
        setResizerBottomRightSpy = spyOn(service, 'setResizerBottomRight');
        service.mouseMoveHandlerRight(mouseEvent);
        expect(setResizerBottomLineSpy).toHaveBeenCalled();
        expect(setResizerRightLineSpy).toHaveBeenCalled();
        expect(setResizerBottomRightSpy).toHaveBeenCalled();
    });
    it('mouseMoveHandlerBottom should do nothing if mousedown is false', () => {
        service.mouseDown = false;
        setResizerRightLineSpy = spyOn(service, 'setResizerRightLine');
        setResizerBottomLineSpy = spyOn(service, 'setResizerBottomLine');
        setResizerBottomRightSpy = spyOn(service, 'setResizerBottomRight');
        service.mouseMoveHandlerBottom(mouseEvent);
        expect(setResizerBottomLineSpy).not.toHaveBeenCalled();
        expect(setResizerRightLineSpy).not.toHaveBeenCalled();
        expect(setResizerBottomRightSpy).not.toHaveBeenCalled();
    });
    it('mouseMoveHandlerBottom should call the setResizers if mousedown is true', () => {
        service.mouseDown = true;
        setResizerRightLineSpy = spyOn(service, 'setResizerRightLine');
        setResizerBottomLineSpy = spyOn(service, 'setResizerBottomLine');
        setResizerBottomRightSpy = spyOn(service, 'setResizerBottomRight');
        service.mouseMoveHandlerBottom(mouseEvent);
        expect(setResizerBottomLineSpy).toHaveBeenCalled();
        expect(setResizerRightLineSpy).toHaveBeenCalled();
        expect(setResizerBottomRightSpy).toHaveBeenCalled();
    });
    it('mouseMoveHandlerCorner should do nothing if mousedown is false', () => {
        service.mouseDown = false;
        setResizerRightLineSpy = spyOn(service, 'setResizerRightLine');
        setResizerBottomLineSpy = spyOn(service, 'setResizerBottomLine');
        setResizerBottomRightSpy = spyOn(service, 'setResizerBottomRight');
        service.mouseMoveHandlerCorner(mouseEvent);
        expect(setResizerBottomLineSpy).not.toHaveBeenCalled();
        expect(setResizerRightLineSpy).not.toHaveBeenCalled();
        expect(setResizerBottomRightSpy).not.toHaveBeenCalled();
    });
    it('mouseMoveHandlerCorner should call the setResizers if mousedown is true', () => {
        service.mouseDown = true;
        setResizerRightLineSpy = spyOn(service, 'setResizerRightLine');
        setResizerBottomLineSpy = spyOn(service, 'setResizerBottomLine');
        setResizerBottomRightSpy = spyOn(service, 'setResizerBottomRight');
        service.mouseMoveHandlerCorner(mouseEvent);
        expect(setResizerBottomLineSpy).toHaveBeenCalled();
        expect(setResizerRightLineSpy).toHaveBeenCalled();
        expect(setResizerBottomRightSpy).toHaveBeenCalled();
    });
    it('forceMaxWidth should return false if offsetX is smaller than the max value', () => {
        const width = 1470;
        const height = 800;
        global.innerWidth = width;
        global.innerHeight = height;
        expect(service.forceMaxWidth(mouseEvent)).toEqual(false);
    });
    it('forceMaxHeight should return false if offsetY is smaller than the max value', () => {
        const width = 1470;
        const height = 800;
        global.innerWidth = width;
        global.innerHeight = height;
        mouseEvent = {
            offsetX: 450,
            offsetY: 650,
        } as MouseEvent;
        expect(service.forceMaxHeight(mouseEvent)).toEqual(false);
    });
    it('forceMaxWidth should return true if offsetX is greater than the max value', () => {
        const width = 1470;
        const height = 800;
        global.innerWidth = width;
        global.innerHeight = height;
        mouseEvent = {
            offsetX: 1450,
            offsetY: 250,
        } as MouseEvent;
        expect(service.forceMaxWidth(mouseEvent)).toEqual(true);
    });
    it('forceMaxHeight should return true if offsetY is greater than the max value', () => {
        const width = 1470;
        const height = 800;
        global.innerWidth = width;
        global.innerHeight = height;
        mouseEvent = {
            offsetX: 450,
            offsetY: 780,
        } as MouseEvent;
        expect(service.forceMaxHeight(mouseEvent)).toEqual(true);
    });
    it('mouseMoveHandlerRight should force max size on posX if mouse offsetX is too big', () => {
        service.mouseDown = true;
        const width = 1460;
        const height = 800;
        const expectedResult = 950;
        global.innerWidth = width;
        global.innerHeight = height;
        mouseEvent = {
            offsetX: 1450,
            offsetY: 250,
        } as MouseEvent;
        service.mouseMoveHandlerRight(mouseEvent);
        expect(service.posX).toEqual(expectedResult);
    });
    it('mouseMoveHandlerRight should force min size on posX if mouse offsetX is too small', () => {
        service.mouseDown = true;
        const width = 1470;
        const height = 800;
        const expectedResult = 250;
        global.innerWidth = width;
        global.innerHeight = height;
        service.mouseMoveHandlerRight(mouseEvent);
        expect(service.posX).toEqual(expectedResult);
    });
    it('mouseMoveHandlerRight should set posX size if mouse offsetX is within bounds', () => {
        service.mouseDown = true;
        const width = 1470;
        const height = 800;
        const expectedResult = 450;
        global.innerWidth = width;
        global.innerHeight = height;
        mouseEvent = {
            offsetX: 450,
            offsetY: 250,
        } as MouseEvent;
        service.mouseMoveHandlerRight(mouseEvent);
        expect(service.posX).toEqual(expectedResult);
    });
    it('mouseMoveHandlerBottom should force max size on posY if mouse offsetY is too big', () => {
        service.mouseDown = true;
        const width = 1470;
        const height = 1000;
        const expectedResult = 950;
        global.innerWidth = width;
        global.innerHeight = height;
        mouseEvent = {
            offsetX: 1450,
            offsetY: 999,
        } as MouseEvent;
        service.mouseMoveHandlerBottom(mouseEvent);
        expect(service.posY).toEqual(expectedResult);
    });
    it('mouseMoveHandlerBottom should force min size on posY if mouse offsetY is too small', () => {
        service.mouseDown = true;
        const width = 1470;
        const height = 800;
        const expectedResult = 250;
        global.innerWidth = width;
        global.innerHeight = height;
        service.mouseMoveHandlerBottom(mouseEvent);
        expect(service.posY).toEqual(expectedResult);
    });
    it('mouseMoveHandlerBottom should set posY size if mouse offsetY is within bounds', () => {
        service.mouseDown = true;
        const width = 1470;
        const height = 800;
        const expectedResult = 650;
        global.innerWidth = width;
        global.innerHeight = height;
        mouseEvent = {
            offsetX: 450,
            offsetY: 650,
        } as MouseEvent;
        service.mouseMoveHandlerBottom(mouseEvent);
        expect(service.posY).toEqual(expectedResult);
    });
    it('mouseMoveHandlerCorner should force min size on posX and posY if mouse offsetX and offsetY are too small', () => {
        service.mouseDown = true;
        const width = 1470;
        const height = 800;
        const expectedResult = 250;
        global.innerWidth = width;
        global.innerHeight = height;
        service.mouseMoveHandlerCorner(mouseEvent);
        expect(service.posX).toEqual(expectedResult);
        expect(service.posY).toEqual(expectedResult);
    });
    it('mouseMoveHandlerCorner should set posX and posY if mouse offsetX and offsetY are within bounds', () => {
        service.mouseDown = true;
        const width = 1470;
        const height = 800;
        const expectedResult = 550;
        global.innerWidth = width;
        global.innerHeight = height;
        mouseEvent = {
            offsetX: 550,
            offsetY: 550,
        } as MouseEvent;
        service.mouseMoveHandlerCorner(mouseEvent);
        expect(service.posX).toEqual(expectedResult);
        expect(service.posY).toEqual(expectedResult);
    });
    it('mouseMoveHandlerCorner should force max on posX and posY if mouse offsetX and offsetY are too big', () => {
        service.mouseDown = true;
        const width = 1460;
        const height = 800;
        const expectedResultX = 950;
        const expectedResultY = 760;
        global.innerWidth = width;
        global.innerHeight = height;
        mouseEvent = {
            offsetX: 1050,
            offsetY: 795,
        } as MouseEvent;
        service.mouseMoveHandlerCorner(mouseEvent);
        expect(service.posX).toEqual(expectedResultX);
        expect(service.posY).toEqual(expectedResultY);
    });
});
