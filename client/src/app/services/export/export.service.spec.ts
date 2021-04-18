import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportService } from '@app/services/export/export.service';
import { PopupService } from '@app/services/modal/popup.service';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
import { ServerRequestService } from '@app/services/server-request/server-request.service';
import { Message } from '@common/communication/message';
import { of, throwError } from 'rxjs';
//  tslint:disable: no-any
describe('ExportService', () => {
    let service: ExportService;
    let drawingService: DrawingService;
    let confirmSpy: jasmine.Spy;
    let createElementSpy: jasmine.Spy;
    let serverRequestService: ServerRequestService;
    let exportImageSpy: jasmine.Spy;
    const popupService = new PopupService();

    beforeEach(() => {
        drawingService = new DrawingService({} as ResizePoint);
        drawingService.canvas = document.createElement('CANVAS') as HTMLCanvasElement;
        serverRequestService = new ServerRequestService({} as HttpClient);
        TestBed.configureTestingModule({
            providers: [
                ExportService,
                { provide: DrawingService, useValue: drawingService },
                { provide: ServerRequestService, useValue: serverRequestService },
                { provide: PopupService, useValue: popupService },
            ],
        });
        service = TestBed.inject(ExportService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set the size of the export canvas ', () => {
        const filter = 'none';
        const drawImageSpy = spyOn(service.context, 'drawImage').and.returnValue();
        service.context.filter = '';
        service.setExportCanvas(filter);
        expect(drawImageSpy).toHaveBeenCalled();
        expect(service.context.filter).toEqual(filter);
    });

    it('should be able to download the canvas with the filter if the format is good', () => {
        const exportSpy = spyOn(service, 'createExportImage').and.returnValue(true);
        const dataSpy = spyOn(service.canvas, 'toDataURL');
        const clickSpy = spyOn(service.anchor, 'click').and.returnValue();
        service.downloadImage('png', 'test', 'none');
        expect(exportSpy).toHaveBeenCalled();
        expect(dataSpy).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalled();
    });

    it('should not be able to download the canvas with the filter if the format isnt good', () => {
        const exportSpy = spyOn(service, 'createExportImage').and.returnValue(false);
        const dataSpy = spyOn(service.canvas, 'toDataURL');
        const clickSpy = spyOn(service.anchor, 'click').and.returnValue();
        service.downloadImage('png', 'test', 'none');
        expect(exportSpy).toHaveBeenCalled();
        expect(dataSpy).not.toHaveBeenCalled();
        expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should export the canvas to Imgur if the image is exportable and show the body of the message if there is one', () => {
        exportImageSpy = spyOn(service, 'createExportImage').and.returnValue(true);
        const message = { body: 'test' } as Message;
        const response: HttpResponse<Message> = new HttpResponse<Message>({ body: message });

        const postSpy = spyOn((service as any).serverRequestService, 'basicPost').and.returnValue(of(response));
        const popupSpy = spyOn((service as any).popupService, 'openPopup').and.returnValue({});
        service.exportToImgur('png', 'DessinTest', 'none');

        expect(postSpy).toHaveBeenCalled();
        expect(exportImageSpy).toHaveBeenCalled();
        expect(popupSpy).toHaveBeenCalledWith("Lien de l'image: " + message.body);
    });

    it('should export the canvas to Imgur if the image is exportable and  not show the body of the message if there is none', () => {
        exportImageSpy = spyOn(service, 'createExportImage').and.returnValue(true);

        const response: HttpResponse<Message> = new HttpResponse<Message>({ body: null });

        const postSpy = spyOn((service as any).serverRequestService, 'basicPost').and.returnValue(of(response));
        const popupSpy = spyOn((service as any).popupService, 'openPopup').and.returnValue({});
        service.exportToImgur('png', 'DessinTest', 'none');

        expect(postSpy).toHaveBeenCalled();
        expect(exportImageSpy).toHaveBeenCalled();
        expect(popupSpy).toHaveBeenCalledWith("Lien de l'image: undefined");
    });

    it('should not export the canvas to Imgur if the image is exportable', () => {
        exportImageSpy = spyOn(service, 'createExportImage').and.returnValue(false);
        const message = { title: 'test' } as Message;
        const response: HttpResponse<Message> = new HttpResponse<Message>({ body: message });
        const postSpy = spyOn((service as any).serverRequestService, 'basicPost').and.returnValue(of(response));
        const popupSpy = spyOn((service as any).popupService, 'openPopup').and.returnValue({});
        service.exportToImgur('png', 'test', 'none');
        expect(postSpy).not.toHaveBeenCalled();
        expect(exportImageSpy).toHaveBeenCalled();
        expect(popupSpy).not.toHaveBeenCalledWith("Lien de l'image" + message.body);
    });

    it('should export the canvas to Imgur if the image is exportable and receive an error if something is wrong', () => {
        exportImageSpy = spyOn(service, 'createExportImage').and.returnValue(true);
        const errorResponse: HttpErrorResponse = new HttpErrorResponse({ status: 0 });

        const postSpy = spyOn((service as any).serverRequestService, 'basicPost').and.returnValue(throwError(errorResponse));
        const popupSpy = spyOn((service as any).popupService, 'openPopup').and.returnValue({});
        service.exportToImgur('png', 'test', 'none');
        expect(postSpy).toHaveBeenCalled();
        expect(exportImageSpy).toHaveBeenCalled();
        expect(popupSpy).toHaveBeenCalledWith('Aucune connection avec le serveur');
    });

    it('should export the canvas to Imgur if the image is exportable and receive an error if something is wrong', () => {
        exportImageSpy = spyOn(service, 'createExportImage').and.returnValue(true);
        const errorResponse: HttpErrorResponse = new HttpErrorResponse({ status: 404, error: 'test' });

        const postSpy = spyOn((service as any).serverRequestService, 'basicPost').and.returnValue(throwError(errorResponse));
        const popupSpy = spyOn((service as any).popupService, 'openPopup').and.returnValue({});
        service.exportToImgur('png', 'test', 'none');
        expect(postSpy).toHaveBeenCalled();
        expect(exportImageSpy).toHaveBeenCalled();
        expect(popupSpy).toHaveBeenCalledWith('test');
    });
    it('should  not export the image if the type and name arent undefined avec un comfirm true ', () => {
        const type = 'png';

        const element: HTMLElement = document.createElement('a');
        createElementSpy = spyOn(document, 'createElement').and.returnValue(element);

        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);

        service.createExportImage(type, '', '');

        expect(createElementSpy).not.toHaveBeenCalled();
        expect(confirmSpy).not.toHaveBeenCalled();
    });

    it('should do nothing if the type is undefined or the name is empty', () => {
        const type = 'png';
        const name = 'test';
        const filtre = 'none';
        const setExportSpy = spyOn(service, 'setExportCanvas');
        confirmSpy = spyOn(window, 'confirm').and.returnValue(false);
        const popupSpy = spyOn((service as any).popupService, 'openPopup').and.returnValue({});
        service.createExportImage(type, name, filtre);
        expect(setExportSpy).not.toHaveBeenCalled();
        expect(popupSpy).not.toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalled();
    });

    it('should export the image if the type and name arent undefined avec un comfirm true ', () => {
        const type = 'png';
        const name = 'test';
        const filtre = 'none';
        const setExportSpy = spyOn(service, 'setExportCanvas');
        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
        const popupSpy = spyOn((service as any).popupService, 'openPopup').and.returnValue({});
        service.createExportImage(type, name, filtre);
        expect(setExportSpy).toHaveBeenCalled();
        expect(popupSpy).not.toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalled();
    });

    it('shouldnt export the image if the type or name are undefined  ', () => {
        const type = 'png';
        const name = ' ';
        const filtre = 'none';
        const setExportSpy = spyOn(service, 'setExportCanvas');
        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
        const popupSpy = spyOn((service as any).popupService, 'openPopup').and.returnValue({});
        service.createExportImage(type, name, filtre);
        expect(setExportSpy).not.toHaveBeenCalled();
        expect(popupSpy).toHaveBeenCalled();
        expect(confirmSpy).not.toHaveBeenCalled();
    });

    it('should check if the name is empty and return false if it is', () => {
        expect(service.checkifNotEmpty('')).not.toBeTrue();
    });
    it('should check if the name is empty and return true if it isnt', () => {
        expect(service.checkifNotEmpty('test')).toBeTrue();
    });

    it('should check if the name is empty and return false if it only contains spaces', () => {
        expect(service.checkifNotEmpty('               ')).not.toBeTrue();
    });
});
