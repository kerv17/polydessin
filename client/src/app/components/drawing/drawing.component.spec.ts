import { SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Tool } from '@app/classes/tool';
import * as Globals from '@app/Constants/constants';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
import { SelectionBoxService } from '@app/services/selection-box/selection-box.service';
import { SelectionMovementService } from '@app/services/selection-movement/selection-movement.service';
import { SelectionResizeService } from '@app/services/selection-resize/selection-resize.service';
import { ServerRequestService } from '@app/services/server-request/server-request.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { AerosolService } from '@app/services/tools/ToolServices/aerosol-service.service';
import { EllipsisService } from '@app/services/tools/ToolServices/ellipsis-service';
import { LineService } from '@app/services/tools/ToolServices/line-service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { RectangleService } from '@app/services/tools/ToolServices/rectangle-service';
import { SelectionService } from '@app/services/tools/ToolServices/selection.service';
import { DrawingComponent } from './drawing.component';
class ToolStub extends Tool {}

// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let fillRectSpy: jasmine.Spy;
    let fillNewSpaceSpy: jasmine.Spy;
    let putImageDataSpy: jasmine.Spy;
    const resizePointStub: ResizePoint = new ResizePoint();
    let toolController: ToolControllerService;
    let carouselService: CarouselService;
    let selectionBoxService: SelectionBoxService;
    let selectionMoveService: SelectionMovementService;
    let selectionResizeService: SelectionResizeService;
    let baseCtxTest: jasmine.SpyObj<CanvasRenderingContext2D>;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService);
        drawingStub = new DrawingService(resizePointStub);
        baseCtxTest = jasmine.createSpyObj('CanvasRenderingContext2D', ['getImageData']);
        drawingStub.baseCtx = baseCtxTest;
        selectionMoveService = new SelectionMovementService(drawingStub, selectionResizeService);
        selectionResizeService = new SelectionResizeService(selectionBoxService);
        toolController = new ToolControllerService(
            {} as PencilService,
            {} as RectangleService,
            {} as LineService,
            {} as EllipsisService,
            {} as AerosolService,
            new SelectionService(drawingStub, selectionMoveService, selectionResizeService),
        );
        carouselService = new CarouselService({} as ServerRequestService, drawingStub, {} as Router);

        selectionBoxService = new SelectionBoxService();
        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: Tool, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
                { provide: ToolControllerService, useValue: toolController },
                { provide: CarouselService, useValue: carouselService },
                { provide: SelectionBoxService, useValue: selectionBoxService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        toolController.currentTool = toolStub;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' ngAfterViewInit should set baseCtx, previewCtx from the component and from the service', () => {
        component.ngAfterViewInit();
        expect((component as any).drawingService['baseCtx']).toEqual(component.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D);
        expect(drawingStub.baseCtx).toEqual((component as any).drawingService['baseCtx']);
        expect((component as any).drawingService['previewCtx']).toEqual(
            component.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D,
        );
        expect(drawingStub.previewCtx).toEqual((component as any).drawingService['previewCtx']);
    });
    it(' ngAfterViewInit should set previewCanva and canva  from drawingService', () => {
        component.ngAfterViewInit();
        expect((component as any).drawingService.previewCanvas).toEqual(component.previewCanvas.nativeElement);
        expect((component as any).drawingService.canvas).toEqual(component.baseCanvas.nativeElement);
        expect(drawingStub.previewCtx).toEqual((component as any).drawingService.previewCtx);
    });
    it(' ngAfterViewInit should set fill the canva baseCtx', () => {
        fillRectSpy = spyOn((component as any).drawingService.baseCtx, 'fillRect');
        component.ngAfterViewInit();
        expect((component as any).drawingService.baseCtx.fillStyle).toEqual('#ffffff');
        expect(fillRectSpy).toHaveBeenCalled();
    });
    it(' ngAfterViewInit should set viewInitialized to true', () => {
        (component as any).viewInitialized = false;
        component['viewInitialized'] = false;
        component.ngAfterViewInit();
        expect((component as any).viewInitialized).toEqual(true);
    });
    it(' ngAfterViewInit should set the primary color and secondary color', () => {
        component.ngAfterViewInit();
        expect((component as any).controller.currentTool.color).toEqual((component as any).colorService.primaryColor);
        expect((component as any).controller.currentTool.color2).toEqual((component as any).colorService.secondaryColor);
    });

    it(' ngOnChanges does not change the previous canva dimension if view is not initialized and not in mouse down', () => {
        fillNewSpaceSpy = spyOn(drawingStub, 'fillNewSpace');
        component['viewInitialized'] = false;
        component.mouseDown = false;
        component.ngOnChanges({});
        expect(fillNewSpaceSpy).not.toHaveBeenCalled();
    });
    it(' ngOnChanges takes the old drawing and puts it on a new canva if view is initialized and mouseDown is false', () => {
        component.widthPrev = 2;
        component.heightPrev = 2;
        fillNewSpaceSpy = spyOn(drawingStub, 'fillNewSpace');
        putImageDataSpy = spyOn((component as any).drawingService['baseCtx'], 'putImageData');
        component['viewInitialized'] = true;
        component.mouseDown = false;
        component.ngOnChanges({});
        expect(putImageDataSpy).toHaveBeenCalled();
        expect(fillNewSpaceSpy).toHaveBeenCalled();
    });
    it(' ngOnChanges set previewCanvas.nativeElement.width if view is initialized, mouseDown is true and changes to widthPrev have occured', () => {
        const expectedValue = 500;
        component['viewInitialized'] = true;
        component.mouseDown = true;
        component.widthPrev = expectedValue;
        component.ngOnChanges({ widthPrev: new SimpleChange(1, component.widthPrev, true) });
        expect(component.previewCanvas.nativeElement.width).toEqual(expectedValue);
    });
    it(' ngOnChanges set previewCanvas.nativeElement.height if view is initialized, mouseDown is true and changes to heightPrev have occured', () => {
        const expectedValue = 500;
        component['viewInitialized'] = true;
        component.mouseDown = true;
        component.heightPrev = expectedValue;
        component.ngOnChanges({ heightPrev: new SimpleChange(1, component.heightPrev, true) });
        expect(component.previewCanvas.nativeElement.height).toEqual(expectedValue);
    });

    it(' ngOnChanges should call onEscape from selectionService if there is an active selection and mouseDown is false', () => {
        component['viewInitialized'] = true;
        component.mouseDown = false;
        component['controller'].selectionService.inSelection = true;
        component.widthPrev = 2;
        component.heightPrev = 2;
        const escapeSpy = spyOn<any>(component['controller'].selectionService, 'onEscape');
        component.ngOnChanges({});
        expect(escapeSpy).toHaveBeenCalled();
    });

    it('should get stubTool', () => {
        const currentTool = component.getCurrentTool();
        expect(currentTool).toEqual(toolStub);
    });

    it(" should call the tool's mouse move when receiving a mouse move event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolController.currentTool, 'onMouseMove');
        component.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });
    it(" should call the tool's mouse down when receiving a mouse down event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolController.currentTool, 'onMouseDown');
        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });
    it(" should call the tool's mouse up when receiving a mouse up event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolController.currentTool, 'onMouseUp');
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });
    it(" should call the tool's click when receiving a mouse click event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolController.currentTool, 'onClick');
        component.onClick(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });
    it(" should call the tool's double click when receiving a mouse dblclick event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolController.currentTool, 'ondbClick');
        component.ondbClick(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });
    it(" should call the tool's mouse leave when receiving a mouse mouseleave event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolController.currentTool, 'onMouseLeave');
        component.onMouseLeave(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });
    it(" should call the tool's mouse enter when receiving a mouse mouseEnter event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolController.currentTool, 'onMouseEnter');
        component.onMouseEnter(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it('ngOnChanges should dispatch an action Event only when allowed', () => {
        (component as any).heightPrev = 2;
        (component as any).widthPrev = 2;

        let actionCalled = false;
        addEventListener('action', (event: CustomEvent) => {
            actionCalled = true;
        });
        (component as any).viewInitialized = true;
        (component as any).mouseDown = false;

        (component as any).allowUndoCall = false;
        component.ngOnChanges({} as SimpleChanges);
        expect(actionCalled).toBeFalse();

        (component as any).allowUndoCall = true;
        component.ngOnChanges({} as SimpleChanges);
        expect(actionCalled).toBeTrue();
    });

    it('ngOnInit should dispatch a undoRedoWipe event', () => {
        (component as any).heightPrev = 2;
        (component as any).widthPrev = 2;

        let actionCalled = false;
        addEventListener('undoRedoWipe', (event: CustomEvent) => {
            actionCalled = true;
        });

        component.ngAfterViewInit();
        expect(actionCalled).toBeTrue();
    });

    it('cursorChange should call cursorChange method from selectionBox Service', () => {
        const cursorSpy = spyOn(component.selectionBoxLayout, 'cursorChange');
        component.cursorChange(Globals.mouseDownEvent);
        expect(cursorSpy).toHaveBeenCalled();
    });

    it('drawSelectionBox should call drawSelectionBox, setHandlers from selectionbox service and return true if there is an active selection', () => {
        toolController.selectionService.inSelection = true;
        const drawSelectionBoxSpy = spyOn(component.selectionBoxLayout, 'drawSelectionBox');
        const setHandlersSpy = spyOn(component.selectionBoxLayout, 'setHandlersPositions');
        expect(component.drawSelectionBox()).toBeTrue();
        expect(drawSelectionBoxSpy).toHaveBeenCalled();
        expect(setHandlersSpy).toHaveBeenCalled();
    });

    it('drawSelectionBox should not call drawSelectionBox, setHandlers from selectionbox service and should return false if there is no active selection', () => {
        toolController.selectionService.inSelection = false;
        const drawSelectionBoxSpy = spyOn(component.selectionBoxLayout, 'drawSelectionBox');
        const setHandlersSpy = spyOn(component.selectionBoxLayout, 'setHandlersPositions');
        expect(component.drawSelectionBox()).not.toBeTrue();
        expect(drawSelectionBoxSpy).not.toHaveBeenCalled();
        expect(setHandlersSpy).not.toHaveBeenCalled();
    });

    it('drawhandlers should return the inSelection value from selectionService', () => {
        toolController.selectionService.inSelection = true;
        expect(component.drawHandlers()).toBeTrue();
        toolController.selectionService.inSelection = false;
        expect(component.drawHandlers()).not.toBeTrue();
    });
    it('should load the carousel picture if one is stored', () => {
        (component as any).carousel = new CarouselService({} as ServerRequestService, drawingStub, {} as Router);

        (component as any).carousel.loadImage = true;

        const loadCanvasSpy = spyOn((component as any).drawingService, 'loadOldCanvas').and.returnValue({});
        component.loadCarouselCanvas();
        expect(loadCanvasSpy).toHaveBeenCalled();
        expect((component as any).carousel.loadImage).not.toBeTrue();
    });

    it('calling allowUndoRedoCall should change the allowUndoCall variable', () => {
        const event: CustomEvent = new CustomEvent('allowUndoCall', { detail: false });
        dispatchEvent(event);
        expect((component as any).allowUndoCall).not.toBeTrue();
    });
});
