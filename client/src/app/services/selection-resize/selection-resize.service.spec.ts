import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionResizeService } from './selection-resize.service';

// tslint:disable: no-any
describe('SelectionResizeService', () => {
    let service: SelectionResizeService;
    let canvasTestHelper: CanvasTestHelper;
    let drawService: DrawingService;
    let path: Vec2[];
    let selectedArea: ImageData;
    const width = 100;
    const height = 100;
    const canvasWidth = 500;
    const canvasHeight = 500;
    const actualHandler = 'actualHandler';
    const resizePathData = 'resizePathData';
    const hasResized = 'hasResized';
    const updatePathData = 'updatePathData';
    const resizeMap = 'resizeMap';
    const resizeImage = 'resizeImage';
    const selectionBox = 'selectionBox';
    const resizeHandler0 = 'resizeHandler0';
    const resizeHandler1 = 'resizeHandler1';
    const resizeHandler2 = 'resizeHandler2';
    const resizeHandler3 = 'resizeHandler3';
    const resizeHandler4 = 'resizeHandler4';
    const resizeHandler5 = 'resizeHandler5';
    const resizeHandler6 = 'resizeHandler6';
    const resizeHandler7 = 'resizeHandler7';

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionResizeService);
        drawService = TestBed.inject(DrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawService.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawService.previewCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawService.canvas = canvasTestHelper.canvas;
        drawService.canvas.width = canvasWidth;
        drawService.canvas.height = canvasHeight;
        path = [{ x: 100, y: 100 }, { x: 200, y: 100 }, { x: 200, y: 200 }, { x: 100, y: 200 }];
        service[selectionBox].setHandlersPositions(path[0], path[0].x, path[0].y);
        selectedArea = drawService.previewCtx.getImageData(path[0].x, path[0].y, width, height);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initializePath should push the values of the path to the resizePath if the resizePath is empty', () => {
        service[resizePathData] = [];
        path.push({ x: 0, y: 0 });
        service.initializePath(path);
        expect(service[resizePathData]).toEqual(path);
    });

    it('initializePath should push the first value of the path as the actual position if the path only has 4 values', () => {
        const expectedPath = [{ x: 100, y: 100 }, { x: 200, y: 100 }, { x: 200, y: 200 }, { x: 100, y: 200 }, { x: 100, y: 100 }];
        service[resizePathData] = [];
        service.initializePath(path);
        expect(service[resizePathData]).toEqual(expectedPath);
    });

    it('initializePath should do nothing if the resizePath is not empty', () => {
        service[resizePathData] = path;
        service.initializePath(path);
        expect(service[resizePathData]).toEqual(path);
    });

    it('resetPath should empty the resizePathData', () => {
        service[resizePathData] = path;
        service.resetPath();
        expect(service[resizePathData]).toEqual([]);
    });

    it('getActualResizedPosition should return the actual position', () => {
        service[resizePathData] = path;
        path.push({ x: 0, y: 0 });
        expect(service.getActualResizedPosition()).toEqual({ x: 0, y: 0 });
    });

    it('getActualResizedWidth should return the absolute value of the width', () => {
        service[resizePathData] = [{ x: 100, y: 100 }, { x: 200, y: 100 }, { x: 50, y: 50 }, { x: 100, y: 200 }];
        const expectedWidth = 50;
        expect(service.getActualResizedWidth()).toEqual(expectedWidth);
    });

    it('getActualResizedHeight should return the absolute value of the height', () => {
        service[resizePathData] = [{ x: 100, y: 100 }, { x: 200, y: 100 }, { x: 50, y: 50 }, { x: 100, y: 200 }];
        const expectedHeight = 50;
        expect(service.getActualResizedHeight()).toEqual(expectedHeight);
    });

    it('onMouseDown should return false if none of the handlers were clicked', () => {
        service[resizePathData] = path;
        expect(service.onMouseDown({ x: 50, y: 50 })).toBeFalse();
    });

    it('onMouseDown should return true and set the actual handler value if one of the handlers was clicked', () => {
        service[resizePathData] = path;
        service[resizePathData].push({ x: 0, y: 0 });
        expect(service.onMouseDown(path[0])).toBeTrue();
        expect(service[actualHandler]).toEqual(0);
    });

    it('onMouseMove should set hasResized to true, call the method corresponding to the clicked handler from the map', () => {
        service[resizePathData] = path;
        service[resizePathData].push({ x: 0, y: 0 });
        const mapSpy = spyOn<any>(service[resizeMap], 'get').and.returnValue(service[resizeHandler0]({ x: 25, y: 25 }, false));
        service[actualHandler] = 0;
        service.onMouseMove(selectedArea, drawService.previewCtx, { x: 25, y: 25 }, false);
        expect(service[hasResized]).toBeTrue();
        expect(mapSpy).toHaveBeenCalled();
        expect(service[resizePathData][0]).toEqual({ x: 25, y: 25 });
    });

    it('onMouseMove should call the method corresponding to the clicked handler from the map', () => {
        service[resizePathData] = path;
        service[resizePathData].push({ x: 0, y: 0 });
        const mapSpy = spyOn<any>(service[resizeMap], 'get').and.callThrough();
        service[actualHandler] = 0;
        service.onMouseMove(selectedArea, drawService.previewCtx, { x: 25, y: 25 }, false);
        expect(service[hasResized]).toBeTrue();
        expect(mapSpy).toHaveBeenCalled();
        expect(service[resizePathData][0]).toEqual({ x: 25, y: 25 });
    });

    it('resizeImage should call scale with -1, -1 and set the bottom right handler as the actual position of the path if width and height are negative', done => {
        service[resizePathData] = [{ x: 100, y: 100 }, { x: 50, y: 100 }, { x: 50, y: 50 }, { x: 100, y: 50 }, { x: 0, y: 0 }];
        const ctxSpy = spyOn<any>(drawService.previewCtx, 'scale');
        service[actualHandler] = Globals.CURRENT_SELECTION_POSITION;
        createImageBitmap(selectedArea).then((imgBitmap: ImageBitmap) => {
            service[resizeImage](drawService.previewCtx, imgBitmap);
            expect(ctxSpy).toHaveBeenCalledWith(Globals.MIRROR_SCALE, Globals.MIRROR_SCALE);
            expect(service[resizePathData][Globals.CURRENT_SELECTION_POSITION]).toEqual(service[resizePathData][2]);
            done();
        });
    });

    it('resizeImage should call scale with -1, 1 and set the topright handler as the actual position if only width is negative', done => {
        service[resizePathData] = [{ x: 100, y: 100 }, { x: 50, y: 100 }, { x: 50, y: 150 }, { x: 100, y: 150 }, { x: 0, y: 0 }];
        const ctxSpy = spyOn<any>(drawService.previewCtx, 'scale');
        service[actualHandler] = 2;
        createImageBitmap(selectedArea).then((imgBitmap: ImageBitmap) => {
            service[resizeImage](drawService.previewCtx, imgBitmap);
            expect(ctxSpy).toHaveBeenCalledWith(Globals.MIRROR_SCALE, 1);
            expect(service[resizePathData][Globals.CURRENT_SELECTION_POSITION]).toEqual(service[resizePathData][Globals.RIGHT_HANDLER]);
            done();
        });
    });

    it('resizeImage should call scale with 1, -1 and set the bottomleft handler as the actual position if only height is negative', done => {
        service[resizePathData] = [{ x: 100, y: 100 }, { x: 150, y: 100 }, { x: 150, y: 50 }, { x: 100, y: 50 }, { x: 0, y: 0 }];
        const ctxSpy = spyOn<any>(drawService.previewCtx, 'scale');
        service[actualHandler] = Globals.BOTTOM_HANDLER;
        createImageBitmap(selectedArea).then((imgBitmap: ImageBitmap) => {
            service[resizeImage](drawService.previewCtx, imgBitmap);
            expect(ctxSpy).toHaveBeenCalledWith(1, Globals.MIRROR_SCALE);
            expect(service[resizePathData][Globals.CURRENT_SELECTION_POSITION]).toEqual(service[resizePathData][1]);
            done();
        });
    });

    it('resizeImage should call drawImage if both width and height are positive', done => {
        service[resizePathData] = [{ x: 100, y: 100 }, { x: 200, y: 100 }, { x: 200, y: 200 }, { x: 100, y: 200 }, { x: 100, y: 100 }];
        const ctxSpy = spyOn<any>(drawService.previewCtx, 'drawImage');
        service[actualHandler] = Globals.CURRENT_SELECTION_POSITION;
        createImageBitmap(selectedArea).then((imgBitmap: ImageBitmap) => {
            service[resizeImage](drawService.previewCtx, imgBitmap);
            expect(ctxSpy).toHaveBeenCalled();
            expect(service[resizePathData][Globals.CURRENT_SELECTION_POSITION]).toEqual(service[resizePathData][0]);
            done();
        });
    });

    it('onMouseUp should return the hasResized boolean value', () => {
        service[hasResized] = false;
        const pathSpy = spyOn<any>(service, 'updatePathData');
        expect(service.onMouseUp()).toBeFalse();
        expect(pathSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should call updatePathData if hasResized is true', () => {
        service[hasResized] = true;
        const pathSpy = spyOn<any>(service, 'updatePathData');
        expect(service.onMouseUp()).toBeTrue();
        expect(pathSpy).toHaveBeenCalled();
    });

    it('setPathDataAfterMovement should call updatePathData if the path is not empty and the actual position changed', () => {
        service[resizePathData] = path;
        service[resizePathData].push({ x: 0, y: 0 });
        const pathSpy = spyOn<any>(service, 'updatePathData');
        service.setPathDataAfterMovement({ x: 50, y: 50 });
        expect(pathSpy).toHaveBeenCalled();
    });

    it('setPathDataAfterMovement should do nothing if the path is empty', () => {
        service[resizePathData] = [];
        const pathSpy = spyOn<any>(service, 'updatePathData');
        service.setPathDataAfterMovement({ x: 0, y: 0 });
        expect(pathSpy).not.toHaveBeenCalled();
    });

    it('setPathDataAfterMovement should do nothing if the actual position has not changed', () => {
        service[resizePathData] = path;
        service[resizePathData][Globals.CURRENT_SELECTION_POSITION] = { x: 0, y: 0 };
        const pathSpy = spyOn<any>(service, 'updatePathData');
        service.setPathDataAfterMovement(service[resizePathData][Globals.CURRENT_SELECTION_POSITION]);
        expect(pathSpy).not.toHaveBeenCalled();
    });

    it('updatePathData should modify the resizePathData based on the actual position of the selection', () => {
        service[resizePathData] = path;
        path.push({ x: 0, y: 0 });
        service[updatePathData]();
        expect(service[resizePathData][0]).toEqual({ x: 0, y: 0 });
        expect(service[resizePathData][1]).toEqual({ x: 0, y: height });
        expect(service[resizePathData][2]).toEqual({ x: width, y: height });
        expect(service[resizePathData][Globals.RIGHT_HANDLER]).toEqual({ x: width, y: 0 });
        expect(service[resizePathData][Globals.CURRENT_SELECTION_POSITION]).toEqual({ x: 0, y: 0 });
    });

    it('resizeHandler0 should update the topleft handler with the mousePosition', () => {
        service[resizePathData] = path;
        service[resizeHandler0]({ x: 50, y: 75 }, false);
        expect(service[resizePathData][0]).toEqual({ x: 50, y: 75 });
    });

    it('resizeHandler0 should update the topleft handler with the same values of width and height if shifted is true', () => {
        service[resizePathData] = path;
        service[resizeHandler0]({ x: 50, y: 75 }, true);
        expect(service[resizePathData][0]).toEqual({ x: 75, y: 75 });
    });

    it('resizeHandler2 should update the topRigth handler with the mousePosition', () => {
        service[resizePathData] = path;
        service[resizeHandler2]({ x: 250, y: 75 }, false);
        expect(service[resizePathData][Globals.RIGHT_HANDLER]).toEqual({ x: 250, y: 75 });
    });

    it('resizeHandler2 should update the topRigth handler with the same values of width and height if shifted is true', () => {
        service[resizePathData] = path;
        service[resizeHandler2]({ x: 250, y: 75 }, true);
        expect(service[resizePathData][Globals.RIGHT_HANDLER]).toEqual({ x: 225, y: 75 });
    });

    it('resizeHandler4 should update the bottomRight handler with the mousePosition', () => {
        service[resizePathData] = path;
        service[resizeHandler4]({ x: 150, y: 175 }, false);
        expect(service[resizePathData][2]).toEqual({ x: 150, y: 175 });
    });

    it('resizeHandler4 should update the bottomRight handler with the same values of width and height if shifted is true', () => {
        service[resizePathData] = path;
        service[resizeHandler4]({ x: 150, y: 175 }, true);
        expect(service[resizePathData][2]).toEqual({ x: 175, y: 175 });
    });

    it('resizeHandler6 should update the bottomleft handler with the mousePosition', () => {
        service[resizePathData] = path;
        service[resizeHandler6]({ x: 75, y: 250 }, false);
        expect(service[resizePathData][1]).toEqual({ x: 75, y: 250 });
    });

    it('resizeHandler6 should update the bottomleft handler with the same values of width and height if shifted is true', () => {
        service[resizePathData] = path;
        service[resizeHandler6]({ x: 75, y: 250 }, true);
        expect(service[resizePathData][1]).toEqual({ x: 50, y: 250 });
    });

    it('resizeHandler1 should update the top handler with the mousePosition', () => {
        service[resizePathData] = path;
        service[resizeHandler1]({ x: 150, y: 50 }, false);
        expect(service[resizePathData][0]).toEqual({ x: 100, y: 50 });
    });

    it('resizeHandler3 should update the right handler with the mousePosition', () => {
        service[resizePathData] = path;
        service[resizeHandler3]({ x: 250, y: 150 }, false);
        expect(service[resizePathData][2]).toEqual({ x: 250, y: 200 });
    });

    it('resizeHandler5 should update the bottom handler with the mousePosition', () => {
        service[resizePathData] = path;
        service[resizeHandler5]({ x: 150, y: 250 }, false);
        expect(service[resizePathData][2]).toEqual({ x: 200, y: 250 });
    });

    it('resizeHandler7 should update the left handler with the mousePosition', () => {
        service[resizePathData] = path;
        service[resizeHandler7]({ x: 50, y: 150 }, false);
        expect(service[resizePathData][0]).toEqual({ x: 50, y: 100 });
    });
});
