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
import { ResizePoint } from '@app/services/resizePoint/resizePoint.service';
import { ResizedEvent } from 'angular-resize-event';
import { EditorComponent } from './editor.component';
class ToolStub extends Tool {}

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let resizeStub: ResizePoint;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService);
        drawingStub = new DrawingService(resizeStub);
        resizeStub = new ResizePoint();
        drawingStub.resizePoint = resizeStub;
        TestBed.configureTestingModule({
            imports: [FormsModule, RouterTestingModule],
            declarations: [EditorComponent, SidebarComponent, DrawingComponent, ColorComponent, WidthSliderComponent, MatSlider],
            providers: [
                { provide: Tool, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
                { provide: ResizePoint, useValue: resizeStub },
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
        component.drawingService.resizePoint.posX = posX;
        component.drawingService.resizePoint.posY = posY;
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
        component.drawingService.resizePoint.posX = posX;
        component.drawingService.resizePoint.posY = posY;
        component.onResize(event);
        expect(component.editorSizeX).toEqual(expectedWidth);
        expect(component.editorSizeY).toEqual(expectedHeight);
    });

    it('mouseDownHandler should set ResizePoint.mouseDown to true and set ResizePoint.position', () => {
        component.drawingService.resizePoint.mouseDown = false;
        const expectedResult = 1;
        component.drawingService.resizePoint.resizerId = 0;
        const event = {} as MouseEvent;
        component.mouseDownHandler(event, expectedResult);
        expect(component.drawingService.resizePoint.resizerId).toEqual(expectedResult);
        expect(component.drawingService.resizePoint.mouseDown).toEqual(true);
    });

    it(' mouseMoveHandler should call the tool mouseMoveHandlerCorner when receiving a mouse move event with position 0', () => {
        component.drawingService.resizePoint.resizerId = 0;
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(resizeStub, 'mouseMoveHandlerCorner');
        component.mouseMoveHandler(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(' mouseMoveHandler should call the tool mouseMoveHandlerBottom when receiving a mouse move event with position 1', () => {
        component.drawingService.resizePoint.resizerId = 1;
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(resizeStub, 'mouseMoveHandlerBottom');
        component.mouseMoveHandler(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(' mouseMoveHandler should call the tool mouseMoveHandlerRight when receiving a mouse move event with position 2', () => {
        component.drawingService.resizePoint.resizerId = 2;
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(resizeStub, 'mouseMoveHandlerRight');
        component.mouseMoveHandler(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it('mouseUpHandler should set ResizePoint.mouseDown to false', () => {
        component.drawingService.resizePoint.mouseDown = true;
        const event = {} as MouseEvent;
        component.mouseUpHandler(event);
        expect(component.drawingService.resizePoint.mouseDown).toEqual(false);
    });

    it('hideResizer should return opposite of ResizePoint.mouseDown', () => {
        component.drawingService.resizePoint.mouseDown = false;
        expect(component.hideResizer()).toEqual(true);
    });
});
