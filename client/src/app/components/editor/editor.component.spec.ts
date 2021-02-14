import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { ColorComponent } from '@app/components/color/color.component';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EditorService } from '@app/services/editor/editor.service';
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
            declarations: [EditorComponent, SidebarComponent, DrawingComponent, ColorComponent],
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

    it('mouseDownHandler should set editorService.mouseDown to true and set editorService.position', () => {
        component.editorService.mouseDown = false;
        const expectedResult = 1;
        component.editorService.position = 0;
        const event = {} as MouseEvent;
        component.mouseDownHandler(event, expectedResult);
        expect(component.editorService.position).toEqual(expectedResult);
        expect(component.editorService.mouseDown).toEqual(true);
    });

    it(' mouseMoveHandler should call the tool mouseMoveHandlerCorner when receiving a mouse move event with position 0', () => {
        component.editorService.position = 0;
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(editorStub, 'mouseMoveHandlerCorner');
        component.mouseMoveHandler(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(' mouseMoveHandler should call the tool mouseMoveHandlerBottom when receiving a mouse move event with position 1', () => {
        component.editorService.position = 1;
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(editorStub, 'mouseMoveHandlerBottom');
        component.mouseMoveHandler(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(' mouseMoveHandler should call the tool mouseMoveHandlerRight when receiving a mouse move event with position 2', () => {
        component.editorService.position = 2;
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
