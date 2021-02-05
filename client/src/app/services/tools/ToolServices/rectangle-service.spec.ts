import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from './rectangle-service';

// tslint:disable:no-any
fdescribe('RectangleService', () => {
    let service: RectangleService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(RectangleService);
        drawLineSpy = spyOn<any>(service, 'drawRectangle').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1, // TODO: Avoir ceci dans un enum accessible
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call drawRectangle if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        //Put down mouse
        service.onMouseDown(mouseEvent);
        //Rise it back up
        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawRectangle if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawRectangle if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseDown(mouseEvent);

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
        expect(service.getPath().length==5)
    });



    it(' onMouseMove should not call drawRectangle if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    // Exemple de test d'intégration qui est quand même utile
    fit(' should change the pixel of the canvas ', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0 } as MouseEvent;
        let mouseEvent1 = mouseEvent;
        service.onMouseDown(mouseEvent1);
        mouseEvent = { offsetX: 3, offsetY: 3, button: 0 } as MouseEvent;
        let mouseEvent2 = mouseEvent;
        service.onMouseUp(mouseEvent2);

        // Premier pixel seulement
        for (var _i = mouseEvent1.offsetX; _i <= mouseEvent2.offsetX, _i++;){
          for (var _j = mouseEvent1.offsetY; _j <= mouseEvent2.offsetY, _j++;){
            let imageData: ImageData = baseCtxStub.getImageData(_i, _j, 1, 1);


            expect(imageData.data[0]).toEqual(0); // R
            expect(imageData.data[1]).toEqual(0); // G
            expect(imageData.data[2]).toEqual(0); // B
            // tslint:disable-next-line:no-magic-numbers
            expect(imageData.data[3]).not.toEqual(0); // A
          }
        }
    });
});
