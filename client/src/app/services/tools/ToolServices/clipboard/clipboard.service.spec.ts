import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionMovementService } from '@app/services/selection-movement/selection-movement.service';
import { SelectionService } from '@app/services/tools/ToolServices/selection.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';
import { ClipboardService } from './clipboard.service';
// tslint:disable: no-any
describe('ClipboardService', () => {
    let service: ClipboardService;
    let selectionService: SelectionService;
    let canvasTestHelper: CanvasTestHelper;
    let drawService: DrawingService;
    let selectionMoveService: SelectionMovementService;
    let selectionSpy: jasmine.Spy;
    let selectionMovementSpy: jasmine.Spy;
    const clipboard = 'clipboard';
    const width = 100;
    const canvasWidth = 500;
    const canvasHeight = 500;
    const pathData = 'pathData';
    const createAction = 'createAction';
    const fakePath = 'fakePath';

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClipboardService);
        selectionService = TestBed.inject(SelectionService);
        selectionMoveService = TestBed.inject(SelectionMovementService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawService = TestBed.inject(DrawingService);
        drawService.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawService.previewCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawService.canvas = canvasTestHelper.canvas;
        drawService.canvas.width = canvasWidth;
        drawService.canvas.height = canvasHeight;
        selectionService[pathData] = [{ x: 100, y: 100 }, { x: 200, y: 100 }, { x: 200, y: 200 }, { x: 100, y: 200 }];
        selectionService.selectedArea = drawService.previewCtx.getImageData(width, width, width, width);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getClipboardStatus should return false if clipboard is undefined', () => {
        expect(service.getClipboardStatus()).toBeFalse();
    });

    it('getClipboardStatus should return true if clipboard is not undefined', () => {
        service[clipboard] = selectionService.selectedArea;
        expect(service.getClipboardStatus()).toBeTrue();
    });

    it('getSelectionStatus should return the inSelection value from the selectionService', () => {
        selectionService.inSelection = false;
        expect(service.getSelectionStatus()).toBeFalse();
        selectionService.inSelection = true;
        expect(service.getSelectionStatus()).toBeTrue();
    });

    it('doAction should call saveSetting, loadSetting and updateCanvasOnMove', () => {
        const action: DrawAction = service[createAction]();
        selectionSpy = spyOn<any>(service, 'loadSetting');
        selectionMovementSpy = spyOn(selectionMoveService, 'updateCanvasOnMove');
        service.doAction(action);
        expect(selectionSpy).toHaveBeenCalled();
        expect(selectionMovementSpy).toHaveBeenCalled();
    });

    it('doAction should set the lassoPath to the pathData value if the toolMode is v (lasso)', () => {
        service[pathData] = selectionService[pathData];
        service.toolMode = Globals.LASSO_SELECTION_SHORTCUT;
        const action: DrawAction = service[createAction]();
        service[pathData] = selectionService[pathData];
        selectionService.lassoPath = [
            { x: 50, y: 50 },
            { x: 150, y: 150 },
            { x: 50, y: 50 },
        ];
        selectionService.toolMode = Globals.LASSO_SELECTION_SHORTCUT;
        service.doAction(action);
        expect(selectionService.lassoPath).toEqual(service[pathData]);
    });

    it('resetClipboard should update clipboard with selectedArea', () => {
        service[clipboard] = selectionService.selectedArea;
        service.resetClipboard();
        expect(service[clipboard]).not.toEqual(selectionService.selectedArea);
    });

    it('copy should store the ImageData of the selection in the clipboard value if there is an active selection', () => {
        selectionService.inSelection = true;
        service.copy();
        expect(service.getClipboardStatus()).toBeTrue();
    });

    it('copy should not store the ImageData of the selection in the clipboard value if there is no active selection', () => {
        selectionService.inSelection = false;
        service.copy();
        expect(service.getClipboardStatus()).toBeFalse();
    });

    it('paste should do nothing if clipboard is undefined', () => {
        selectionService.inSelection = false;
        const fakePathSpy = spyOn<any>(service, 'fakePath');
        service.paste();
        expect(fakePathSpy).not.toHaveBeenCalled();
        expect(selectionService.inSelection).toBeFalse();
    });

    it('paste should call putImageData, fakePath and set inSelection to true if there is an image stored in the clipboard', () => {
        selectionService[pathData].push({ x: 50, y: 50 });
        service[pathData] = selectionService[pathData];
        selectionService.inSelection = false;
        service[clipboard] = selectionService.selectedArea;
        const fakePathSpy = spyOn<any>(service, 'fakePath');
        service.paste();
        expect(fakePathSpy).toHaveBeenCalled();
        expect(selectionService.inSelection).toBeTrue();
    });

    it('paste should dispatch a resetLassoToolMode event if toolMode from selection is v (lasso)', () => {
        selectionService[pathData].push({ x: 50, y: 50 });
        service[pathData] = selectionService[pathData];
        selectionService.inSelection = false;
        service[clipboard] = selectionService.selectedArea;
        selectionService.toolMode = Globals.LASSO_SELECTION_SHORTCUT;
        service.paste();
        expect(selectionService.toolMode).toEqual('');
    });

    it('cut should do nothing if there is no active selection', () => {
        selectionService.inSelection = false;
        const copySpy = spyOn(service, 'copy');
        service.cut();
        expect(copySpy).not.toHaveBeenCalled();
    });

    it('cut should call the copy and delete method if there is an active selection', () => {
        selectionService[pathData].push({ x: 50, y: 50 });
        service[pathData] = selectionService[pathData];
        service[clipboard] = selectionService.selectedArea;
        selectionService.inSelection = true;
        const copySpy = spyOn(service, 'copy');
        service.cut();
        expect(copySpy).toHaveBeenCalled();
    });

    it('delete should do nothing if inSelection is false', () => {
        selectionService.inSelection = false;
        selectionMovementSpy = spyOn(selectionMoveService, 'updateCanvasOnMove');
        selectionSpy = spyOn<any>(service, 'dispatchAction');
        service.delete();
        expect(selectionMovementSpy).not.toHaveBeenCalled();
        expect(selectionSpy).not.toHaveBeenCalled();
    });

    it('delete should call updateCanvasOnMove, dispatchAction and set inSelection to false if inSelection is true', () => {
        selectionService[pathData].push({ x: 50, y: 50 });
        service[pathData] = selectionService[pathData];
        service[clipboard] = selectionService.selectedArea;
        selectionService.inSelection = true;
        selectionMovementSpy = spyOn(selectionMoveService, 'updateCanvasOnMove');
        selectionSpy = spyOn<any>(service, 'dispatchAction');
        service.delete();
        expect(selectionService.inSelection).toBeFalse();
        expect(selectionMovementSpy).toHaveBeenCalled();
        expect(selectionSpy).toHaveBeenCalled();
    });

    it('delete should dispatch a resetLassoToolMode event if toolMode from selection is v (lasso)', () => {
        selectionService[pathData].push({ x: 50, y: 50 });
        service[pathData] = selectionService[pathData];
        selectionService.lassoPath = [
            { x: 50, y: 50 },
            { x: 150, y: 150 },
            { x: 50, y: 50 },
        ];
        service[clipboard] = selectionService.selectedArea;
        selectionService.inSelection = true;
        selectionService.toolMode = Globals.LASSO_SELECTION_SHORTCUT;
        service.delete();
        expect(selectionService.toolMode).toEqual('');
        expect(service[pathData]).toEqual(selectionService.lassoPath);
    });

    it('fakePath should create a fake path that is outside the current canvas with the width and height of the selection', () => {
        selectionService.setPathData([]);
        service[clipboard] = selectionService.selectedArea;
        service[fakePath]();
        expect(selectionService.getPathData()).not.toEqual([]);
    });

    it('delete should dispatch saveState Event', () => {
        selectionService.inSelection = true;
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);
        service.delete();
        expect(spyDispatch).toHaveBeenCalled();
    });
});
