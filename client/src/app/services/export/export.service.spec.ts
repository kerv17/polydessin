import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
import { ExportService } from './export.service';
describe('ExportService', () => {
    let service: ExportService;
    let drawingService: DrawingService;
    let confirmSpy: jasmine.Spy;
    let createElementSpy: jasmine.Spy;

    beforeEach(() => {
        drawingService = new DrawingService({} as ResizePoint);
        drawingService.canvas = document.createElement('CANVAS') as HTMLCanvasElement;
        TestBed.configureTestingModule({
            providers: [ExportService, { provide: DrawingService, useValue: drawingService }],
        });
        service = TestBed.inject(ExportService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should export the image if the type and name arent undefined avec un comfirm true ', () => {
        const type = 'png';
        const name = 'test';
        let element: HTMLElement = document.createElement('a');
        createElementSpy = spyOn(document, 'createElement').and.returnValue(element);

        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);

        service.exportImage(type, name);

        expect(createElementSpy).toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalled();
    });

    it('should  not export the image if the type and name arent undefined avec un comfirm true ', () => {
        const type = 'png';

        let element: HTMLElement = document.createElement('a');
        createElementSpy = spyOn(document, 'createElement').and.returnValue(element);

        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);

        service.exportImage(type, '');

        expect(createElementSpy).not.toHaveBeenCalled();
        expect(confirmSpy).not.toHaveBeenCalled();
    });
});
