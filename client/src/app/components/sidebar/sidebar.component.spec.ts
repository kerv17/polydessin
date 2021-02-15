import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlider } from '@angular/material/slider';
import { ColorComponent } from '@app/components/color/color.component';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EditorService } from '@app/services/editor/editor.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
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

    let openToolSpy: jasmine.Spy;
    let drawingStubSpy: jasmine.Spy;
    let toolControllerSpy: jasmine.SpyObj<ToolControllerService>;
    let eventSpy: jasmine.Spy;

    beforeEach(async(() => {
        drawingStub = new DrawingServiceStub({} as EditorService);
        toolControllerSpy = jasmine.createSpyObj(ToolControllerService, ['setTool']);
        TestBed.configureTestingModule({
            declarations: [SidebarComponent, MatSlider, ColorComponent],
            providers: [
                SidebarComponent,
                { provide: ToolControllerService, useValue: toolControllerSpy },
                { provide: DrawingService, useValue: drawingStub },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('it should set the values to show all elements needed for crayon and the rest false at initialization', () => {
        expect(component.showWidth).toEqual(true);
        expect(component.resetSlider).toEqual(true);
        expect(component.fillBorder).toEqual(false);
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
        expect(toolControllerSpy.setTool).toHaveBeenCalledWith(Globals.CRAYON_SHORTCUT);
    });

    it('OpenRectangle should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');
        component.openRectangle();
        expect(openToolSpy).toHaveBeenCalledWith(showFillOptions, showWidth);
        expect(component.rectangle).toEqual(Globals.BACKGROUND_GAINSBORO);
        expect(toolControllerSpy.setTool).toHaveBeenCalledWith(Globals.RECTANGLE_SHORTCUT);
    });

    it('OpenRectangle should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');
        component.openRectangle();
        expect(openToolSpy).toHaveBeenCalledWith(showFillOptions, showWidth);
        expect(component.rectangle).toEqual(Globals.BACKGROUND_GAINSBORO);
        expect(toolControllerSpy.setTool).toHaveBeenCalledWith(Globals.RECTANGLE_SHORTCUT);
    });
    it('OpenLine should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');
        component.openLine();
        expect(openToolSpy).toHaveBeenCalledWith(!showFillOptions, showWidth, true);
        expect(component.line).toEqual(Globals.BACKGROUND_GAINSBORO);
        expect(toolControllerSpy.setTool).toHaveBeenCalledWith(Globals.LINE_SHORTCUT);
    });
    it('OpenEllipsis should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');
        component.openEllipsis();
        expect(openToolSpy).toHaveBeenCalledWith(showFillOptions, showWidth);
        expect(component.ellipsis).toEqual(Globals.BACKGROUND_GAINSBORO);
        expect(toolControllerSpy.setTool).toHaveBeenCalledWith(Globals.ELLIPSIS_SHORTCUT);
    });
    it('OpenTool should flip the slider status variable and se showWidth and FillBorder', () => {
        openToolSpy = spyOn(component, 'setButtonWhite');
        const tempSlidervalue = component.resetSlider;
        component.openTool(showFillOptions, showWidth);
        expect(openToolSpy).toHaveBeenCalled();
        expect(component.fillBorder).toEqual(showFillOptions);
        expect(component.showWidth).toEqual(showWidth);
        expect(component.resetSlider).toEqual(!tempSlidervalue);
    });

    it('newCanvas should call drawingService nouveau dessin', () => {
        drawingStubSpy = spyOn(drawingStub, 'newCanvas');
        component.newCanvas();

        expect(drawingStubSpy).toHaveBeenCalled();
    });

    it('checking if onkeyPress creates a new drawing with a Ctrl+O keyboard event', () => {
        const keyEventData = { isTrusted: true, key: 'o', ctrlKey: true };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);

        eventSpy = spyOn(keyDownEvent, 'preventDefault');
        drawingStubSpy = spyOn(drawingStub, 'newCanvas');
        // component.onKeyPress(event);
        window.dispatchEvent(keyDownEvent);
        expect(eventSpy).toHaveBeenCalled();
        expect(drawingStubSpy).toHaveBeenCalled();
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

    it('checking if onKeyPress does nothing if both if the Ctrl Key is bad', () => {
        drawingStubSpy = spyOn(drawingStub, 'newCanvas');

        const keyEventData = { isTrusted: true, key: 'o', ctrlKey: false };
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
