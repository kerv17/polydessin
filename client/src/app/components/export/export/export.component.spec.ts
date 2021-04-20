import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportService } from '@app/services/export/export.service';
import { PopupService } from '@app/services/modal/popup.service';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
import { ServerRequestService } from '@app/services/server-request/server-request.service';
import { ExportComponent } from './export.component';
describe('ExportComponent', () => {
    let component: ExportComponent;
    let fixture: ComponentFixture<ExportComponent>;
    let exportService: ExportService;
    let drawingService: DrawingService;
    const serverRequestService: ServerRequestService = {} as ServerRequestService;
    let drawImageSpy: jasmine.Spy;
    let exportImageSpy: jasmine.Spy;
    const four = 4;

    beforeEach(async(() => {
        drawingService = new DrawingService({} as ResizePoint);
        drawingService.canvas = document.createElement('CANVAS') as HTMLCanvasElement;

        exportService = new ExportService(drawingService, serverRequestService, {} as PopupService);
        exportService.showModalExport = false;
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [ExportComponent],
            providers: [ExportComponent, { provide: ExportService, useValue: exportService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        fixture.debugElement.nativeElement.style.visibility = 'hidden';
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(component.width).toBe(global.innerWidth / four);
        expect(component.height).toBe(global.innerHeight / four);
    });
    it('should change the preview Canvas size on resize', () => {
        global.innerHeight = 0;
        global.innerWidth = 0;
        component.ctx.canvas.height = 1;
        component.ctx.canvas.width = 1;
        drawImageSpy = spyOn(component.ctx, 'drawImage').and.returnValue();
        component.onResize();
        expect(drawImageSpy).toHaveBeenCalled();
        expect(component.ctx.canvas.height).toEqual(0);
        expect(component.ctx.canvas.width).toEqual(0);
    });

    it('ngAfterView should set the right values ', () => {
        drawImageSpy = spyOn(component.ctx, 'drawImage');
        component.ngAfterViewInit();
        expect(drawImageSpy).toHaveBeenCalled();
        expect(component.width).toBe(global.innerWidth / four);
        expect(component.height).toBe(global.innerHeight / four);
        expect(component.ctx).toEqual(component.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D);
    });

    it('should set the right mode', () => {
        const test = 'test';
        component.toggleMode(test);
        expect(component.exportMode).toEqual(test);
    });

    it('should export to Imgur', () => {
        // tslint:disable-next-line: no-any
        const exportToImgurSpy = spyOn((component as any).exportService, 'exportToImgur').and.returnValue({});
        component.exportImgur();
        expect(exportToImgurSpy).toHaveBeenCalled();
    });

    it('should set the right filter', () => {
        drawImageSpy = spyOn(component.ctx, 'drawImage');
        const test = 'none';
        component.setFilter(test);
        expect(component.filter).toEqual(test);
        expect(component.ctx.filter).toEqual(test);
        expect(drawImageSpy).toHaveBeenCalled();
    });
    // tslint:disable:no-any
    it('should call the service export method', () => {
        exportImageSpy = spyOn((component as any).exportService, 'downloadImage');
        component.exportPicture();
        expect(exportImageSpy).toHaveBeenCalled();
    });

    it('close should change the showModal value', () => {
        (component as any).exportService.showModalExport = true;
        component.close();
        expect((component as any).exportService.showModalExport).not.toBeTrue();
    });
});
