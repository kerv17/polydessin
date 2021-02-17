import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ColorComponent } from '@app/components/color/color.component';
import { WidthSliderComponent } from '@app/components/width-slider/width-slider.component';
import * as Globals from '@app/Constants/constants';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EditorService } from '@app/services/editor/editor.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { EllipsisService } from '@app/services/tools/ToolServices/ellipsis-service';
import { LineService } from '@app/services/tools/ToolServices/line-service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { RectangleService } from '@app/services/tools/ToolServices/rectangle-service';
import { SidebarComponent } from './sidebar.component';
export class DrawingServiceStub extends DrawingService {
    newCanvas(): void {
        return;
    }
}

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
    let setWhiteSpy: jasmine.Spy;
    let resetWidthSpy: jasmine.Spy;
    let mapSpy: jasmine.Spy;

    let eventSpy: jasmine.Spy;
    const router = {
        navigate: jasmine.createSpy('navigate'),
    };

    beforeEach(async(() => {
        drawingStub = new DrawingServiceStub({} as EditorService);
        toolController = new ToolControllerService({} as PencilService, {} as RectangleService, {} as LineService, {} as EllipsisService);
        colorService = new ColorService();
        TestBed.configureTestingModule({
            imports: [FormsModule, RouterTestingModule],
            declarations: [SidebarComponent, ColorComponent, MatSlider, WidthSliderComponent],
            providers: [
                SidebarComponent,
                WidthSliderComponent,
                { provide: ToolControllerService, useValue: toolController },
                { provide: DrawingService, useValue: drawingStub },
                { provide: ColorService, useValue: colorService },
                { provide: Router, useValue: router },
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

    it('it should set the values to show all elements needed for crayon and the rest false at initialization', () => {
        expect(component.showWidth).toEqual(true);
        expect(component.resetAttributes).toEqual(true);
        expect(component.fillBorder).toEqual(false);
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
    it('it should set all the background colors of the buttons to white except crayon ', () => {
        expect(component.crayon).toEqual(Globals.BACKGROUND_GAINSBORO);
        expect(component.rectangle).toEqual(Globals.BACKGROUND_WHITE);
        expect(component.line).toEqual(Globals.BACKGROUND_WHITE);
        expect(component.ellipsis).toEqual(Globals.BACKGROUND_WHITE);
    });

    it('OpenCrayon should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');
        component.openCrayon();

        expect(component.crayon).toEqual(Globals.BACKGROUND_GAINSBORO);
        expect(openToolSpy).toHaveBeenCalledWith(!showFillOptions, showWidth);
        expect(toolControllerSpy).toHaveBeenCalledWith(Globals.CRAYON_SHORTCUT);
    });

    it('OpenRectangle should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');
        component.openRectangle();
        expect(openToolSpy).toHaveBeenCalledWith(showFillOptions, showWidth);
        expect(component.rectangle).toEqual(Globals.BACKGROUND_GAINSBORO);
        expect(toolControllerSpy).toHaveBeenCalledWith(Globals.RECTANGLE_SHORTCUT);
    });

    it('OpenRectangle should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');
        component.openRectangle();
        expect(openToolSpy).toHaveBeenCalledWith(showFillOptions, showWidth);
        expect(component.rectangle).toEqual(Globals.BACKGROUND_GAINSBORO);
        expect(toolControllerSpy).toHaveBeenCalledWith(Globals.RECTANGLE_SHORTCUT);
    });

    it('OpenLine should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');
        component.openLine();
        expect(openToolSpy).toHaveBeenCalledWith(!showFillOptions, showWidth, true);
        expect(component.line).toEqual(Globals.BACKGROUND_GAINSBORO);
        expect(toolControllerSpy).toHaveBeenCalledWith(Globals.LINE_SHORTCUT);
    });
    it('OpenEllipsis should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');
        component.openEllipsis();
        expect(openToolSpy).toHaveBeenCalledWith(showFillOptions, showWidth);
        expect(component.ellipsis).toEqual(Globals.BACKGROUND_GAINSBORO);
        expect(toolControllerSpy).toHaveBeenCalledWith(Globals.ELLIPSIS_SHORTCUT);
    });
    it('OpenTool should flip the slider status variable and set showWidth and FillBorder', () => {
        setWhiteSpy = spyOn(component, 'setButtonWhite');
        const tempSlidervalue = component.resetAttributes;

        component.openTool(showFillOptions, showWidth, false);
        expect(setWhiteSpy).toHaveBeenCalled();
        expect(component.fillBorder).toEqual(showFillOptions);
        expect(component.showWidth).toEqual(showWidth);
        expect(component.resetAttributes).toEqual(!tempSlidervalue);
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

    it('checking if onkeyPress creates a new drawing with a Ctrl+O keyboard event', () => {
        const keyEventData = { isTrusted: true, key: Globals.NEW_DRAWING_EVENT, ctrlKey: true };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);

        eventSpy = spyOn(keyDownEvent, 'preventDefault');
        drawingStubSpy = spyOn(drawingStub, 'newCanvas');

        window.dispatchEvent(keyDownEvent);
        expect(eventSpy).toHaveBeenCalled();
        expect(drawingStubSpy).toHaveBeenCalled();
    });

    it('checking if onkeyPress calls Map.get() if its a toolkey', () => {
        component.initMap();
        const keyEventData = { isTrusted: true, key: Globals.ELLIPSIS_SHORTCUT, ctrlKey: true };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        openToolSpy = spyOn(component, 'openTool');
        mapSpy = spyOn(component.functionMap, 'get').and.returnValue(component.openEllipsis);
        toolController.focused = true;

        window.dispatchEvent(keyDownEvent);
        expect(mapSpy).toHaveBeenCalledWith(Globals.ELLIPSIS_SHORTCUT);
        expect(openToolSpy).toHaveBeenCalled();
    });

    it('checking if onkeyPress calls Map.get() if its a toolkey', () => {
        component.initMap();
        const keyEventData = { isTrusted: true, key: Globals.ELLIPSIS_SHORTCUT, ctrlKey: true };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        openToolSpy = spyOn(component, 'openTool');
        mapSpy = spyOn(component.functionMap, 'get').and.returnValue(component.openEllipsis);
        toolController.focused = false;

        window.dispatchEvent(keyDownEvent);
        expect(mapSpy).not.toHaveBeenCalledWith(Globals.ELLIPSIS_SHORTCUT);
        expect(openToolSpy).not.toHaveBeenCalled();
    });

    it('checking if onKeyPress does nothing if both event keys are bad', () => {
        drawingStubSpy = spyOn(drawingStub, 'newCanvas');

        const keyEventData = { isTrusted: true, key: 'x', ctrlKey: true };

        const event = new KeyboardEvent('keydown', keyEventData);

        eventSpy = spyOn(event, 'preventDefault');
        window.dispatchEvent(event);
        expect(eventSpy).not.toHaveBeenCalled();
        expect(drawingStubSpy).not.toHaveBeenCalled();
    });

    it('checking if onKeyPress does nothing if the Ctrl Key is bad', () => {
        drawingStubSpy = spyOn(drawingStub, 'newCanvas');

        const keyEventData = { isTrusted: true, key: Globals.NEW_DRAWING_EVENT, ctrlKey: false };
        const event = new KeyboardEvent('keydown', keyEventData);
        window.dispatchEvent(event);
        eventSpy = spyOn(event, 'preventDefault');

        expect(eventSpy).not.toHaveBeenCalled();
        expect(drawingStubSpy).not.toHaveBeenCalled();
    });

    it('setButtonWhite should set all icons to white', () => {
        component.setButtonWhite();
        expect(component.crayon).toEqual(Globals.BACKGROUND_WHITE);
        expect(component.rectangle).toEqual(Globals.BACKGROUND_WHITE);
        expect(component.line).toEqual(Globals.BACKGROUND_WHITE);
        expect(component.ellipsis).toEqual(Globals.BACKGROUND_WHITE);
    });
});
