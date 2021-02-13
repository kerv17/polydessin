import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlider } from '@angular/material/slider';
import { ColorComponent } from '@app/components/color/color.component';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EditorService } from '@app/services/editor/editor.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { SidebarComponent } from './sidebar.component';

export class DrawingServiceStub extends DrawingService {
    nouveauDessin(): void {
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
    it('it should give ShowWidth Visible ,fill border,reset Slider default values of false', () => {
        expect(component.visible).toEqual(false);
        expect(component.showWidth).toEqual(false);
        expect(component.resetSlider).toEqual(false);
        expect(component.fillBorder).toEqual(false);
    });

    it('it should set all the background colors of the buttons to white', () => {
        expect(component.crayon).toEqual(Globals.backgroundWhite);
        expect(component.rectangle).toEqual(Globals.backgroundWhite);
        expect(component.line).toEqual(Globals.backgroundWhite);
        expect(component.ellipsis).toEqual(Globals.backgroundWhite);
    });

    it('OpenCrayon should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');

        component.openCrayon();

        expect(component.crayon).toEqual(Globals.backgroundGainsoboro);
        expect(openToolSpy).toHaveBeenCalledWith(!showFillOptions, showWidth);
        expect(toolControllerSpy.setTool).toHaveBeenCalledWith(Globals.crayonShortcut);
    });

    it('OpenRectangle should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');
        component.openRectangle();
        expect(openToolSpy).toHaveBeenCalledWith(showFillOptions, showWidth);
        expect(component.rectangle).toEqual(Globals.backgroundGainsoboro);
        expect(toolControllerSpy.setTool).toHaveBeenCalledWith(Globals.rectangleShortcut);
    });

    it('OpenRectangle should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');
        component.openRectangle();
        expect(openToolSpy).toHaveBeenCalledWith(showFillOptions, showWidth);
        expect(component.rectangle).toEqual(Globals.backgroundGainsoboro);
        expect(toolControllerSpy.setTool).toHaveBeenCalledWith(Globals.rectangleShortcut);
    });
    it('OpenLine should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');
        component.openLine();
        expect(openToolSpy).toHaveBeenCalledWith(!showFillOptions, showWidth);
        expect(component.line).toEqual(Globals.backgroundGainsoboro);
        expect(toolControllerSpy.setTool).toHaveBeenCalledWith(Globals.lineShortcut);
    });
    it('OpenEllipsis should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');
        component.openEllipsis();
        expect(openToolSpy).toHaveBeenCalledWith(showFillOptions, showWidth);
        expect(component.ellipsis).toEqual(Globals.backgroundGainsoboro);
        expect(toolControllerSpy.setTool).toHaveBeenCalledWith(Globals.ellipsisShortcut);
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

    it('nouveauDessin should call drawingService nouveau dessin', () => {
        drawingStubSpy = spyOn(drawingStub, 'nouveauDessin');
        component.nouveauDessin();

        expect(drawingStubSpy).toHaveBeenCalled();
    });

    it('checking if onkeyPress creates a new drawing with a Ctrl+O keyboard event', () => {
        const event = new KeyboardEvent('keydown', {
            key: 'o',
            ctrlKey: true,
        });

        eventSpy = spyOn(event, 'preventDefault');
        drawingStubSpy = spyOn(drawingStub, 'nouveauDessin');
        component.onKeyPress(event);
        expect(eventSpy).toHaveBeenCalled();
        expect(drawingStubSpy).toHaveBeenCalled();
    });

    it('checking if onKeyPress does nothing if both event keys are bad', () => {
        drawingStubSpy = spyOn(drawingStub, 'nouveauDessin');

        const event = new KeyboardEvent('keydown', {
            key: 'x',
            ctrlKey: false,
        });
        eventSpy = spyOn(event, 'preventDefault');
        component.onKeyPress(event);
        expect(eventSpy).not.toHaveBeenCalled();
        expect(drawingStubSpy).not.toHaveBeenCalled();
    });

    it('checking if onKeyPress does nothing if both if the Ctrl Key is bad', () => {
        drawingStubSpy = spyOn(drawingStub, 'nouveauDessin');

        const event = new KeyboardEvent('keydown', {
            key: '0',
            ctrlKey: true,
        });
        eventSpy = spyOn(event, 'preventDefault');
        component.onKeyPress(event);
        expect(eventSpy).not.toHaveBeenCalled();
        expect(drawingStubSpy).not.toHaveBeenCalled();
    });

    it('setButtonWhite should set all icons to white', () => {
        component.setButtonWhite();
        expect(component.crayon).toEqual(Globals.backgroundWhite);
        expect(component.rectangle).toEqual(Globals.backgroundWhite);
        expect(component.line).toEqual(Globals.backgroundWhite);
        expect(component.ellipsis).toEqual(Globals.backgroundWhite);
    });
});
