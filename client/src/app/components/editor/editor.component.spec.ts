import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { RouterTestingModule } from '@angular/router/testing';
import { Tool } from '@app/classes/tool';
import { ColorComponent } from '@app/components/color/color.component';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { WidthSliderComponent } from '@app/components/width-slider/width-slider.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EditorService } from '@app/services/editor/editor.service';
import { ResizedEvent } from 'angular-resize-event';
import { EditorComponent } from './editor.component';
class ToolStub extends Tool {}

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let editorStub: EditorService;
    const editorService: EditorService = new EditorService();

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService);
        drawingStub = new DrawingService(editorService);
        editorStub = new EditorService();

        TestBed.configureTestingModule({
            imports: [FormsModule, RouterTestingModule],
            declarations: [EditorComponent, SidebarComponent, DrawingComponent, ColorComponent, WidthSliderComponent, MatSlider],
            providers: [
                { provide: Tool, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
                { provide: EditorService, useValue: editorStub },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onResize should increase editorSizeX and editorSizeX if canvas is bigger than the window to ensure control points are accessible', () => {
        const width = 1000;
        const height = 400;
        const posX = 1030;
        const posY = 800;
        const expectedWidth = 1650;
        const expectedHeight = 880;
        const event = {} as ResizedEvent;
        global.innerWidth = width;
        global.innerHeight = height;
        component.editorService.posX = posX;
        component.editorService.posY = posY;
        component.onResize(event);
        expect(component.editorSizeX).toEqual(expectedWidth);
        expect(component.editorSizeY).toEqual(expectedHeight);
    });
    it('onResize should decrease editorSizeX and editorSizeX if canvas is smaller than the window to remove the scroll bar', () => {
        const width = 1000;
        const height = 800;
        const posX = 500;
        const posY = 400;
        const event = {} as ResizedEvent;
        const expectedWidth = 1000;
        const expectedHeight = 800;
        global.innerWidth = width;
        global.innerHeight = height;
        component.editorService.posX = posX;
        component.editorService.posY = posY;
        component.onResize(event);
        expect(component.editorSizeX).toEqual(expectedWidth);
        expect(component.editorSizeY).toEqual(expectedHeight);
    });

    it('mouseDownHandler should set editorService.mouseDown to true and set editorService.position', () => {
        component.editorService.mouseDown = false;
        const expectedResult = 1;
        component.editorService.resizerId = 0;
        const event = {} as MouseEvent;
        component.mouseDownHandler(event, expectedResult);
        expect(component.editorService.resizerId).toEqual(expectedResult);
        expect(component.editorService.mouseDown).toEqual(true);
    });

    it(' mouseMoveHandler should call the tool mouseMoveHandlerCorner when receiving a mouse move event with position 0', () => {
        component.editorService.resizerId = 0;
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(editorStub, 'mouseMoveHandlerCorner');
        component.mouseMoveHandler(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(' mouseMoveHandler should call the tool mouseMoveHandlerBottom when receiving a mouse move event with position 1', () => {
        component.editorService.resizerId = 1;
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(editorStub, 'mouseMoveHandlerBottom');
        component.mouseMoveHandler(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(' mouseMoveHandler should call the tool mouseMoveHandlerRight when receiving a mouse move event with position 2', () => {
        component.editorService.resizerId = 2;
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(editorStub, 'mouseMoveHandlerRight');
        component.mouseMoveHandler(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it('mouseUpHandler should set editorService.mouseDown to false', () => {
        component.editorService.mouseDown = true;
        const event = {} as MouseEvent;
        component.mouseUpHandler(event);
        expect(component.editorService.mouseDown).toEqual(false);
    });

    it('hideResizer should return opposite of editorService.mouseDown', () => {
        component.editorService.mouseDown = false;
        expect(component.hideResizer()).toEqual(true);
    });
});
