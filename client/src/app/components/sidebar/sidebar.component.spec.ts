import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ColorComponent } from '@app/components/color/color.component';
import { WidthSliderComponent } from '@app/components/width-slider/width-slider.component';
import * as Globals from '@app/Constants/constants';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportService } from '@app/services/export/export.service';
import { GridService } from '@app/services/grid/grid.service';
import { RemoteSaveService } from '@app/services/remote-save/remote-save.service';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
import { SelectionMovementService } from '@app/services/SelectionMovement/selection-movement.service';
import { ServerRequestService } from '@app/services/server-request/server-request.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { AerosolService } from '@app/services/tools/ToolServices/aerosol-service.service';
import { EllipsisService } from '@app/services/tools/ToolServices/ellipsis-service';
import { LineService } from '@app/services/tools/ToolServices/line-service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { RectangleService } from '@app/services/tools/ToolServices/rectangle-service';
import { SelectionService } from '@app/services/tools/ToolServices/selection.service';
import { StampService } from '@app/services/tools/ToolServices/stamp.service';
import { SidebarComponent } from './sidebar.component';

export class DrawingServiceStub extends DrawingService {
    newCanvas(): void {
        return;
    }
}

type ToolParam = {
    showWidth: boolean;
    toolName: string;
};
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    const showFillOptions = true;
    const showWidth = true;
    let drawingStub: DrawingServiceStub;
    let toolControllerSpy: jasmine.Spy;
    let colorService: ColorService;
    let colorSpy: jasmine.Spy;
    let resetDrawingSpy: jasmine.Spy;
    let openToolSpy: jasmine.Spy;
    let drawingStubSpy: jasmine.Spy;
    let toolController: ToolControllerService;
    let remoteSaveServiceStub: RemoteSaveService;
    let resetWidthSpy: jasmine.Spy;
    let mapSpy: jasmine.Spy;
    let carouselService: CarouselService;
    let selectionMovementService: SelectionMovementService;
    let canvasTestHelper;
    let exportService: ExportService;
    let eventSpy: jasmine.Spy;
    const router = jasmine.createSpyObj(Router, ['navigate']);

    beforeEach(async(() => {
        drawingStub = new DrawingServiceStub({} as ResizePoint);
        exportService = new ExportService(drawingStub, {} as ServerRequestService);
        remoteSaveServiceStub = new RemoteSaveService(drawingStub, {} as ServerRequestService);
        selectionMovementService = new SelectionMovementService();
        toolController = new ToolControllerService(
            new PencilService(drawingStub),
            new RectangleService(drawingStub),
            new LineService(drawingStub),
            new EllipsisService(drawingStub),
            new AerosolService(drawingStub),
            new SelectionService(drawingStub, selectionMovementService),
            new StampService(drawingStub),
        );
        colorService = new ColorService();
        carouselService = new CarouselService({} as ServerRequestService, drawingStub, router);
        TestBed.configureTestingModule({
            imports: [FormsModule, RouterTestingModule],
            declarations: [SidebarComponent, ColorComponent, MatSlider, WidthSliderComponent],
            providers: [
                SidebarComponent,
                WidthSliderComponent,
                { provide: ToolControllerService, useValue: toolController },
                { provide: DrawingService, useValue: drawingStub },
                { provide: ColorService, useValue: colorService },
                { provide: CarouselService, useValue: carouselService },
                { provide: Router, useValue: router },
                { provide: RemoteSaveService, useValue: remoteSaveServiceStub },
                { provide: ExportService, useValue: exportService },
            ],
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        toolControllerSpy = spyOn(toolController, 'setTool');
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should add two event listeners in the constructor', () => {
        const c: CustomEvent = new CustomEvent('undoRedoState', {
            detail: [false, true],
        });
        dispatchEvent(c);
        expect(component.redo).toEqual(Globals.BACKGROUND_WHITE);
        expect(component.undo).toEqual(Globals.BACKGROUND_DARKGREY);
    });
    it('should add two event listeners in the constructor', () => {
        const c: CustomEvent = new CustomEvent('undoRedoState', {
            detail: [true, false],
        });
        dispatchEvent(c);
        expect(component.undo).toEqual(Globals.BACKGROUND_WHITE);
        expect(component.redo).toEqual(Globals.BACKGROUND_DARKGREY);
    });
    it('it should set the values to show all elements needed for crayon and the rest false at initialization', () => {
        expect(component.showWidth).toEqual(true);
        expect(component.resetAttributes).toEqual(false);
    });
    it('should go back and call resetDrawing', () => {
        resetDrawingSpy = spyOn(component, 'resetDrawingAttributes');
        component.goBack();
        expect(resetDrawingSpy).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['..']);
    });
    it('should reset all drawing attributes', () => {
        colorSpy = spyOn(colorService, 'resetColorValues');
        resetWidthSpy = spyOn(toolController, 'resetWidth');
        component.resetDrawingAttributes();
        expect(colorSpy).toHaveBeenCalled();
        expect(resetWidthSpy).toHaveBeenCalled();
    });
    it('should open the export modal', () => {
        component.exportService.showModalExport = false;
        component.openExport();

        expect(component.exportService.showModalExport).toBe(true);
    });
    it('should call toolControllerSetTool ', () => {
        component.setTool(Globals.ELLIPSIS_SHORTCUT);
        expect(toolControllerSpy).toHaveBeenCalledWith(Globals.ELLIPSIS_SHORTCUT);
    });
    // tslint:disable:no-any
    it('should call the selectionService method select Canvas with the full size ', () => {
        canvasTestHelper = new CanvasTestHelper();
        (component as any).drawing.canvas = (canvasTestHelper as any).createCanvas();
        (component as any).drawing.canvas.height = Globals.SIDEBAR_WIDTH; // pour fin de test
        (component as any).drawing.canvas.width = Globals.SIDEBAR_WIDTH; // pour fin de test
        const selectionSpy = spyOn(((component as any).toolController as any).selectionService, 'selectCanvas');
        component.selectCanvas();
        expect(selectionSpy).toHaveBeenCalled();
    });
    it('should open the Carrousel Modal when we click on the button ', () => {
        const carouselSpy = spyOn(component.carouselService, 'initialiserCarousel');
        component.openCarousel();
        expect(carouselSpy).toHaveBeenCalled();
    });
    it('should open the Save Modal when we click on the button ', () => {
        component.remoteSaveService.showModalSave = false;
        component.openSave();
        expect(component.remoteSaveService.showModalSave).toEqual(true);
    });
    it('should open the Save Modal when we click on the button ', () => {
        component.remoteSaveService.showModalSave = false;
        component.openSave();
        expect(component.remoteSaveService.showModalSave).toEqual(true);
    });
    it('should open the Save Modal when we click on the button ', () => {
        component.remoteSaveService.showModalSave = false;
        component.openSave();
        expect(component.remoteSaveService.showModalSave).toEqual(true);
    });
    it('should check if the current tool is Aerosol and show its specific options if it is', () => {
        component.showAerosol = false;
        component.currentTool = Globals.AEROSOL_SHORTCUT;
        component.showAerosolInterface();
        expect(component.showAerosol).toEqual(true);
    });
    it('should check if the current tool is Aerosol and not show its specific options if it isnt', () => {
        component.showAerosol = false;
        component.currentTool = Globals.CRAYON_SHORTCUT;
        component.showAerosolInterface();
        expect(component.showAerosol).toEqual(false);
    });
    it('should check if the current tool is Line and not show its specific options if it isnt', () => {
        component.showLine = false;
        component.currentTool = Globals.CRAYON_SHORTCUT;
        component.showLineOptions();
        expect(component.showLine).toEqual(false);
    });
    it('should check if the current tool is Line and show its specific options if it is', () => {
        component.showLine = false;
        component.currentTool = Globals.LINE_SHORTCUT;
        component.showLineOptions();
        expect(component.showLine).toEqual(true);
    });
    it('should check if the current tool is Rectangle or Ellipsis and show its specific options if it is', () => {
        component.shapeOptions = false;
        component.currentTool = Globals.ELLIPSIS_SHORTCUT;
        component.showShapeOptions();
        expect(component.shapeOptions).toEqual(true);
    });
    it('should check if the current tool is Rectangle or Ellipsis and not show its specific options if it is', () => {
        component.shapeOptions = true;
        component.currentTool = Globals.CRAYON_SHORTCUT;
        component.showShapeOptions();
        expect(component.shapeOptions).toEqual(false);
    });
    it('should cancel the selection on toolSwap if theres something selected', () => {
        const escapeSpy = spyOn(((component as any).toolController as any).selectionService, 'onEscape');
        ((component as any).toolController as any).selectionService.inSelection = true;
        component.annulerSelection();
        expect(escapeSpy).toHaveBeenCalled();
    });
    it('should not cancel the selection on toolSwap if theres not something selected', () => {
        const escapeSpy = spyOn(((component as any).toolController as any).selectionService, 'onEscape');
        ((component as any).toolController as any).selectionService.inSelection = false;
        component.annulerSelection();
        expect(escapeSpy).not.toHaveBeenCalled();
    });
    it('OpenTool should flip the slider status variable and set showWidth and FillBorder', () => {
        const originalResetValue = component.resetAttributes;
        const lineSpy = spyOn(component, 'showLineOptions');
        const aerorolSpy = spyOn(component, 'showAerosolInterface');
        const shapeSpy = spyOn(component, 'showShapeOptions');
        component.openTool(showFillOptions, Globals.AEROSOL_SHORTCUT);
        expect(component.resetAttributes).not.toEqual(originalResetValue);
        expect(component.currentTool).toEqual(Globals.AEROSOL_SHORTCUT);
        expect(component.showWidth).toEqual(showWidth);
        expect(lineSpy).toHaveBeenCalled();
        expect(aerorolSpy).toHaveBeenCalled();
        expect(shapeSpy).toHaveBeenCalled();
    });
    it('newCanvas should call drawingService nouveau dessin', () => {
        toolController.lineService = new LineService(drawingStub);
        const spy = spyOn(toolController.lineService, 'clearPath');
        drawingStubSpy = spyOn(drawingStub, 'newCanvas');
        toolController.currentTool = new LineService(drawingStub);

        component.newCanvas();

        expect(drawingStubSpy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });
    it('newCanvas should call the reset methods from services', () => {
        toolController.lineService = new LineService(drawingStub);
        const spy = spyOn(toolController.lineService, 'clearPath');
        const resetColorSpy = spyOn(colorService, 'resetColorValues');
        resetWidthSpy = spyOn(toolController, 'resetWidth');
        const resetToolsModeSpy = spyOn(toolController, 'resetToolsMode');

        component.newCanvas();

        expect(spy).toHaveBeenCalled();
        expect(resetColorSpy).toHaveBeenCalled();
        expect(resetWidthSpy).toHaveBeenCalled();
        expect(resetToolsModeSpy).toHaveBeenCalled();
    });
    it('showGrid should call the toggleGrid method from GridService', () => {
        component.gridService = new GridService(drawingStub);
        const spy = spyOn(component.gridService, 'toggleGrid');
        component.showGrid();
        expect(spy).toHaveBeenCalled();
    });
    it('checking if onkeyPress creates a new drawing with a Ctrl+O keyboard event', () => {
        const keyEventData = { isTrusted: true, key: Globals.NEW_DRAWING_EVENT, ctrlKey: true, shiftKey: false };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);

        eventSpy = spyOn(keyDownEvent, 'preventDefault');
        drawingStubSpy = spyOn(drawingStub, 'newCanvas');

        window.dispatchEvent(keyDownEvent);
        expect(eventSpy).toHaveBeenCalled();
        expect(drawingStubSpy).toHaveBeenCalled();
    });
    it('checking if onkeyPress calls Map.get() if its a toolkey', () => {
        component.initToolMap();
        const keyEventData = { isTrusted: true, key: Globals.ELLIPSIS_SHORTCUT, ctrlKey: false, shiftKey: false };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        component.currentTool = Globals.CRAYON_SHORTCUT;
        mapSpy = spyOn((component as any).toolParamMap, 'get').and.returnValue({ showWidth: true, toolName: Globals.ELLIPSIS_SHORTCUT } as ToolParam);
        toolController.focused = true;

        window.dispatchEvent(keyDownEvent);
        expect(mapSpy).toHaveBeenCalledWith([false, false, Globals.ELLIPSIS_SHORTCUT].join());
        expect(component.currentTool).toEqual(Globals.ELLIPSIS_SHORTCUT);
    });
    it('checking if onkeyPress calls Map.get() if its a toolkey but ctrl is true', () => {
        const keyEventData = { isTrusted: true, key: Globals.ELLIPSIS_SHORTCUT, ctrlKey: true };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        openToolSpy = spyOn(component, 'openTool');
        mapSpy = spyOn((component as any).functionMap, 'get').and.returnValue({ showWidth: true, toolName: Globals.ELLIPSIS_SHORTCUT } as ToolParam);
        toolController.focused = false;
        window.dispatchEvent(keyDownEvent);
        expect(mapSpy).not.toHaveBeenCalledWith([true, Globals.ELLIPSIS_SHORTCUT].join());
        expect(openToolSpy).not.toHaveBeenCalled();
    });
    it('should do nothing if the showModalValue is true ', () => {
        component.exportService.showModalExport = true;
        component.initToolMap();
        const keyEventData = { isTrusted: true, key: Globals.ELLIPSIS_SHORTCUT, ctrlKey: false, shiftKey: false };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        component.currentTool = Globals.CRAYON_SHORTCUT;
        mapSpy = spyOn((component as any).toolParamMap, 'get').and.returnValue({ showWidth: true, toolName: Globals.ELLIPSIS_SHORTCUT } as ToolParam);
        toolController.focused = true;
        window.dispatchEvent(keyDownEvent);
        expect(mapSpy).not.toHaveBeenCalledWith([false, false, Globals.ELLIPSIS_SHORTCUT].join());
        expect(component.currentTool).not.toEqual(Globals.ELLIPSIS_SHORTCUT);
    });
    it('should not call anything if the return value is null ', () => {
        component.initFunctionMap();
        const keyEventData = { isTrusted: true, key: Globals.NEW_DRAWING_EVENT, ctrlKey: true, shiftKey: false };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        const functionSpy = spyOn((component as any).functionMap, 'get').and.returnValue(null);
        const newDrawingSpy = spyOn(component, 'newCanvas');
        component.onKeyPress(keyDownEvent);
        expect(functionSpy).toHaveBeenCalled();
        expect(newDrawingSpy).not.toHaveBeenCalled();
    });
    it('should call the undoRedoService redo method if there is no active selection', () => {
        toolController.selectionService.inSelection = false;
        const redoSpy = spyOn((component as any).undoRedoService, 'redo');
        component.redoAction();
        expect(redoSpy).toHaveBeenCalled();
    });
    it('should call the undoRedoService undo method if there is no active selection', () => {
        toolController.selectionService.inSelection = false;
        const undoSpy = spyOn((component as any).undoRedoService, 'undo');
        component.undoAction();
        expect(undoSpy).toHaveBeenCalled();
    });
    it('should not call the undoRedoService redo method if there is an active selection', () => {
        toolController.selectionService.inSelection = true;
        const redoSpy = spyOn((component as any).undoRedoService, 'redo');
        component.redoAction();
        expect(redoSpy).not.toHaveBeenCalled();
    });
    it('should not call the undoRedoService undo method if there is an active selection', () => {
        toolController.selectionService.inSelection = true;
        const undoSpy = spyOn((component as any).undoRedoService, 'undo');
        component.undoAction();
        expect(undoSpy).not.toHaveBeenCalled();
    });
});
