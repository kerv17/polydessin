import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ColorComponent } from '@app/components/color/color.component';
import { WidthSliderComponent } from '@app/components/width-slider/width-slider.component';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportService } from '@app/services/export/export.service';
import { RemoteSaveService } from '@app/services/remote-save/remote-save.service';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
import { SelectionBoxService } from '@app/services/selection-box/selection-box.service';
import { SelectionMovementService } from '@app/services/selection-movement/selection-movement.service';
import { SelectionResizeService } from '@app/services/selection-resize/selection-resize.service';
import { ServerRequestService } from '@app/services/server-request/server-request.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { AerosolService } from '@app/services/tools/ToolServices/aerosol-service.service';
import { BucketService } from '@app/services/tools/ToolServices/bucket.service';
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
// tslint:disable:no-any
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;

    let drawingStub: DrawingServiceStub;

    let colorService: ColorService;

    let toolController: ToolControllerService;
    let remoteSaveServiceStub: RemoteSaveService;

    let carouselService: CarouselService;
    let selectionBoxService: SelectionBoxService;
    let selectionMoveService: SelectionMovementService;
    let selectionResizeService: SelectionResizeService;

    let exportService: ExportService;

    const router = jasmine.createSpyObj(Router, ['navigate']);
    beforeEach(async(() => {
        drawingStub = new DrawingServiceStub({} as ResizePoint);
        exportService = new ExportService(drawingStub, {} as ServerRequestService);
        remoteSaveServiceStub = new RemoteSaveService(drawingStub, {} as ServerRequestService);
        selectionMoveService = new SelectionMovementService(drawingStub, selectionResizeService);
        selectionBoxService = new SelectionBoxService();
        selectionResizeService = new SelectionResizeService(selectionBoxService);
        toolController = new ToolControllerService(
            new PencilService(drawingStub),
            new RectangleService(drawingStub),
            new LineService(drawingStub),
            new EllipsisService(drawingStub),
            new AerosolService(drawingStub),
            new SelectionService(drawingStub, selectionMoveService, selectionResizeService),
            new StampService(drawingStub),
            new BucketService(drawingStub),
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
