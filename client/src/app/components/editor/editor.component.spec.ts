import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { RouterTestingModule } from '@angular/router/testing';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ColorComponent } from '@app/components/color/color.component';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { WidthSliderComponent } from '@app/components/width-slider/width-slider.component';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
import { ResizedEvent } from 'angular-resize-event';
import { EditorComponent } from './editor.component';

class ToolStub extends Tool {}

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let resizeStub: ResizePoint;
    let colorService: ColorService;
    let whateverSpy: jasmine.Spy;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService);
        //    const width = 1000;
        //    const height = 400;
        //   global.innerHeight = height;
        //   global.innerWidth = width;
        drawingStub = new DrawingService(resizeStub);
        resizeStub = new ResizePoint();
        drawingStub.resizePoint = resizeStub;
        colorService = new ColorService();
        TestBed.configureTestingModule({
            imports: [FormsModule, RouterTestingModule, HttpClientTestingModule],
            declarations: [EditorComponent, SidebarComponent, DrawingComponent, ColorComponent, WidthSliderComponent, MatSlider],
            providers: [
                { provide: Tool, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
                { provide: ResizePoint, useValue: resizeStub },
                { provide: ColorService, useValue: colorService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        //   const width = 900;
        //  const height = 400;
        drawingStub.canvasSize = { x: 250, y: 250 } as Vec2;
        whateverSpy = spyOn(drawingStub, 'initializeCanvas').and.returnValue({ x: 250, y: 250 } as Vec2);
        spyOn(drawingStub.resizePoint, 'resetControlPoints').and.returnValue();
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        //  component.drawingService.controlSize.x = width;
        // component.drawingService.controlSize.y = height;
        // component.drawingService.resizePoint.posX = width;
        // component.drawingService.resizePoint.posY = height;
    });

    it('should create', () => {
        expect(whateverSpy).toHaveBeenCalled();
        expect(component).toBeTruthy();
    });

    it('onResize should increase editorSizeX and editorSizeY if canvas is bigger than the window to ensure control points are accessible', () => {
        const width = 1000;
        const height = 400;
        const posX = 1030;
        const posY = 800;
        const expectedWidth = 1551;
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
        const mouseEventSpy = spyOn(resizeStub, 'mouseMoveHandlerCorner').and.returnValue();
        component.mouseMoveHandler(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(' mouseMoveHandler should call the tool mouseMoveHandlerBottom when receiving a mouse move event with position 1', () => {
        component.drawingService.resizePoint.resizerId = 1;
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(resizeStub, 'mouseMoveHandlerBottom').and.returnValue();
        component.mouseMoveHandler(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(' mouseMoveHandler should call the tool mouseMoveHandlerRight when receiving a mouse move event with position 2', () => {
        component.drawingService.resizePoint.resizerId = 2;
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(resizeStub, 'mouseMoveHandlerRight').and.returnValue();
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

    it('get visibility should return the visibility value from the colorService', () => {
        colorService.modalVisibility = true;
        expect(component.visibility).toEqual(true);
        colorService.modalVisibility = false;
        expect(component.visibility).toEqual(false);
    });

    it(' closeModal should toggle visibility attribute to false ', () => {
        component.closeModal();
        expect(component.visibility).toEqual(false);
        expect(colorService.modalVisibility).toEqual(false);
    });
});
