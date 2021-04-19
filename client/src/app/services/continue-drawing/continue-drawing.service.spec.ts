/* tslint:disable:no-unused-variable */
// tslint:disable:no-any
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CanvasInformation } from '@common/communication/canvas-information';
import { ContinueDrawingService } from './continue-drawing.service';

describe('Service: ContinueDrawing', () => {
    let service: ContinueDrawingService;
    let canvasTestHelper: CanvasTestHelper;
    let drawService: DrawingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ContinueDrawingService);
        drawService = TestBed.inject(DrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawService.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawService.previewCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawService.gridCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawService.canvas = canvasTestHelper.canvas;
        drawService.previewCanvas = canvasTestHelper.canvas;
        drawService.gridCanvas = canvasTestHelper.canvas;
        drawService.baseCtx.canvas.width = 1;
        drawService.baseCtx.canvas.height = 1;
    });

    it('should be created ', () => {
        expect(service).toBeTruthy();
    });

    it('saveCanvas is called when a baseCtx is modified so saveState is dispatched', () => {
        const spy = spyOn(service as any, 'saveCanvas');
        const event = new CustomEvent('saveState', {});
        dispatchEvent(event);
        expect(spy).toHaveBeenCalled();
    });

    it('continueCanvas is called when main page button continue is clicked', () => {
        const spy = spyOn(service as any, 'continueCanvas');
        const event = new CustomEvent('continue', {});
        dispatchEvent(event);
        expect(spy).toHaveBeenCalled();
    });

    it('saveCanvas stores information in localStorage', () => {
        jasmine.clock().install();
        (service as any).saveCanvas();
        jasmine.clock().tick(1);
        expect(localStorage.getItem('imageHeight')).toEqual('1');
        expect(localStorage.getItem('imageWidth')).toEqual('1');
        expect(localStorage.getItem('thereIsSavedDrawing')).toEqual('true');
        jasmine.clock().uninstall();
    });

    it('continueCanvas set continueDrawing at true in localStorage', () => {
        (service as any).continueCanvas();
        expect(localStorage.getItem('userWantsContinue')).toEqual('true');
    });

    it('canvasExists returns true if drawingSavedName is true', () => {
        localStorage.setItem('thereIsSavedDrawing', 'false');
        let answer = service.canvasExists();
        expect(answer).toEqual(false);
        localStorage.setItem('thereIsSavedDrawing', 'true');
        answer = service.canvasExists();
        expect(answer).toEqual(true);
    });

    it('canvasContinue returns true if continueDrawing is true', () => {
        localStorage.setItem('userWantsContinue', 'false');
        let answer = service.canvasContinue();
        expect(answer).toEqual(false);
        localStorage.setItem('userWantsContinue', 'true');
        answer = service.canvasContinue();
        expect(answer).toEqual(true);
    });

    it('insertSavedCanvas should charge the image into the canvas and call sendCanvasToUndoredo', () => {
        const setCanvasSpy = spyOn(service.drawingService, 'setCanvassSize');
        (service as any).insertSavedCanvas({ width: 1, height: 1, imageData: '' } as CanvasInformation);
        if ((service as any).img.onload) {
            // on test la fonction lamda pour voir si elle appelle un dispatch
            (service as any).img.onload({} as Event);
        }
        expect(setCanvasSpy).toHaveBeenCalled();
    });

    it('getSavedCanvas should do nothing if canvas doesnt exist', () => {
        const canvasExistSpy = spyOn(service, 'canvasExists').and.returnValue(false);
        const storageGetSpy = spyOn(localStorage, 'getItem');
        service.getSavedCanvas();
        expect(canvasExistSpy).toHaveBeenCalled();
        expect(storageGetSpy).not.toHaveBeenCalled();
    });

    it('getSavedCanvas should do nothing if continue is false', () => {
        const canvasExistSpy = spyOn(service, 'canvasExists').and.returnValue(true);
        const continueSpy = spyOn(service, 'canvasContinue').and.returnValue(false);
        const storageGetSpy = spyOn(localStorage, 'getItem');
        service.getSavedCanvas();
        expect(canvasExistSpy).toHaveBeenCalled();
        expect(continueSpy).toHaveBeenCalled();
        expect(storageGetSpy).not.toHaveBeenCalled();
    });

    it('getSavedCanvas should get values and set continue at false if continue is true and canvas exists', () => {
        localStorage.setItem('thereIsSavedDrawing', 'true');
        localStorage.setItem('userWantsContinue', 'true');
        service.getSavedCanvas();
        const answer = service.canvasContinue();
        expect(answer).toEqual(false);
    });

    it('getSavedCanvas not call insertSavedCanvas if data is null', () => {
        localStorage.setItem('thereIsSavedDrawing', 'true');
        localStorage.setItem('userWantsContinue', 'true');
        localStorage.removeItem('drawing');
        const insertSpy = spyOn(service as any, 'insertSavedCanvas');
        service.getSavedCanvas();
        expect(insertSpy).not.toHaveBeenCalled();
    });
    it('getSavedCanvas call insertSavedCanvas if data is not null', () => {
        localStorage.setItem('thereIsSavedDrawing', 'true');
        localStorage.setItem('userWantsContinue', 'true');
        localStorage.setItem('drawing', 'data');
        const insertSpy = spyOn(service as any, 'insertSavedCanvas');
        service.getSavedCanvas();
        expect(insertSpy).toHaveBeenCalled();
    });

    it('sendCanvasToUndoRedo dispatch  allowUndoCall and undoRedoWipe', () => {
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);

        const img = new Image();
        const size: Vec2 = { x: 1, y: 1 };
        (service as any).sendCanvasToUndoRedo(img, size);

        expect(spyDispatch).toHaveBeenCalled();
    });
});
