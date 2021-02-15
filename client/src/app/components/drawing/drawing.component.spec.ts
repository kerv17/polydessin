import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EditorService } from '@app/services/editor/editor.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { EllipsisService } from '@app/services/tools/ToolServices/ellipsis-service';
import { LineService } from '@app/services/tools/ToolServices/line-service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { RectangleService } from '@app/services/tools/ToolServices/rectangle-service';
import { DrawingComponent } from './drawing.component';
class ToolStub extends Tool {}

fdescribe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let fillRectSpy: jasmine.Spy;
    const editorStub: EditorService = new EditorService();
    let toolController: ToolControllerService;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService);
        drawingStub = new DrawingService(editorStub);
        toolController = new ToolControllerService({} as PencilService,{} as RectangleService,{} as LineService, {} as EllipsisService  );

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: Tool, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
                {provide : ToolControllerService, useValue: toolController},
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' ngAfterViewInit should set baseCtx, previewCtx from the component and from the service', () => {
        component.ngAfterViewInit();
        expect((component as any).baseCtx).toEqual(component.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D);
        expect(drawingStub.baseCtx).toEqual((component as any).baseCtx);
        expect((component as any).previewCtx).toEqual(component.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D);
        expect(drawingStub.previewCtx).toEqual((component as any).previewCtx);
    });
    it(' ngAfterViewInit should set previewCanva and canva  from drawingService', () => {
        component.ngAfterViewInit();
        expect((component as any).drawingService.previewCanvas).toEqual(component.previewCanvas.nativeElement);
        expect((component as any).drawingService.canvas).toEqual(component.baseCanvas.nativeElement);
        expect(drawingStub.previewCtx).toEqual((component as any).previewCtx);
    });
    it(' ngAfterViewInit should set fill the canva baseCtx', () => {
        fillRectSpy = spyOn((component as any).baseCtx, 'fillRect');
        component.ngAfterViewInit();
        expect((component as any).baseCtx.fillStyle).toEqual('#ffffff');
        expect( fillRectSpy).toHaveBeenCalled();
    });
    it(' ngAfterViewInit should set viewInitialized to true', () => {
        (component as any).viewInitialized =false;
        component.ngAfterViewInit();
        expect((component as any).viewInitialized).toEqual(true);
    });
    it(' ngAfterViewInit should set the primary color and secondary color', () => {
        component.ngAfterViewInit();
        expect((component as any).controller.currentTool.color).toEqual((component as any).colorService.primaryColor);
        expect((component as any).controller.currentTool.color2).toEqual((component as any).colorService.secondaryColor);
    });
    

   /* it(' ngOnChanges does not change the previous canva dimension if view is not initialized and not in mouse down ', () => {
        (component as any).viewInitialized = false;
        component.mouseDown = false;
       

        

        expect(drawSpy).not.toHaveBeenCalled();
    });

    it(' ngOnChanges does not call draw function if hue did not change ', () => {
        drawSpy = spyOn(component, 'draw');

        component.ngOnChanges({});
        fixture.detectChanges();

        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('should get stubTool', () => {
        const currentTool = component.getCurrentTool();
        expect(currentTool).toEqual(toolStub);
    });

    /*it(" should call the tool's mouse move when receiving a mouse move event", () => {
        const event = {} as MouseEvent;
        
        toolControllerSpy.currentTool.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    }); 

    it(" should call the tool's mouse down when receiving a mouse down event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseDown').and.callThrough();
        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse up when receiving a mouse up event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    }); */
});
