// tslint:disable:no-unused-variable
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ServerRequestService } from '@app/services/index/server-request.service';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
import { CanvasInformation } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { /*BehaviorSubject, Observable,*/ of, throwError } from 'rxjs';
import { RemoteSaveService } from './remote-save.service';

fdescribe('Service: RemoteSave', () => {
    let service: RemoteSaveService;
    let drawingService: DrawingService;
    let requestService: ServerRequestService;
    let confirmSpy: jasmine.Spy;
    let basicPostSpy: jasmine.Spy;
    let alertSpy: jasmine.Spy;
    let testinformation: CanvasInformation;
    let badTestinformation: CanvasInformation;
    beforeEach(() => {
        drawingService = new DrawingService({} as ResizePoint);
        drawingService.canvas = document.createElement('CANVAS') as HTMLCanvasElement;
        requestService = new ServerRequestService({} as HttpClient);
        TestBed.configureTestingModule({
            providers: [
                RemoteSaveService,
                { provide: DrawingService, useValue: drawingService },
                { provide: ServerRequestService, useValue: requestService },
            ],
        });

        service = TestBed.inject(RemoteSaveService);

        testinformation = {
            codeID: '507f1f77bcf86cd799439011',
            name: 'DessinTest',
            tags: ['tag1', 'tag2'],
            format: 'png',
            height: 300,
            width: 300,
            imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAe8AAADICAYAgCwdx/6eZ4uCaQM',
        };
        badTestinformation = {
            codeID: '507f1f77bcf86cd799439011',
            name: 'DessiTest',
            tags: ['tag1', 'tag2'],
            format: 'png',
            height: 300,
            width: 300,
            imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAe8AAADICAYAgCwdx/6eZ4uCaQM',
        };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should save the image information is valid and comfirm true and show message', () => {
        const message = { title: 'test' } as Message;
        const response: HttpResponse<Message> = new HttpResponse<Message>({ body: message });
        basicPostSpy = spyOn(requestService, 'basicPost').and.returnValue(of(response));
        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
        service.post(testinformation);
        expect(basicPostSpy).toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalled();
    });
    it('should save the image information is valid and comfirm true and show null', () => {
        const response: HttpResponse<Message> = new HttpResponse<Message>({ body: null });
        basicPostSpy = spyOn(requestService, 'basicPost').and.returnValue(of(response));
        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
        service.post(testinformation);
        expect(basicPostSpy).toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalled();
    });
    it('should save the image information  is valid even if there are no tags and comfirm true ', () => {
        const message = { title: 'test' } as Message;
        const response: HttpResponse<Message> = new HttpResponse<Message>({ body: message });
        basicPostSpy = spyOn(requestService, 'basicPost').and.returnValue(of(response));
        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
        service.post(testinformation);
        expect(basicPostSpy).toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalled();
    });
    it('should do nothing if information is valid but comfirm false', () => {
        testinformation.tags = [];
        basicPostSpy = spyOn(requestService, 'basicPost');
        confirmSpy = spyOn(window, 'confirm').and.returnValue(false);
        service.post(testinformation);
        expect(basicPostSpy).not.toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalled();
    });
    it('should send a window alert if information is valid and comfirm true but no connection to server', () => {
        const response: HttpErrorResponse = new HttpErrorResponse({ status: 0 });
        basicPostSpy = spyOn(requestService, 'basicPost').and.returnValue(throwError(response));
        alertSpy = spyOn(window, 'alert');
        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
        service.post(testinformation);
        expect(basicPostSpy).toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalled();
        expect(alertSpy).toHaveBeenCalledWith('Aucune connection avec le serveur');
    });
    it('should send a window alert if information is valid and comfirm true but something went wrong on server', () => {
        const response: HttpErrorResponse = new HttpErrorResponse({ error: 'une erreure', status: 10 });
        basicPostSpy = spyOn(requestService, 'basicPost').and.returnValue(throwError(response));
        alertSpy = spyOn(window, 'alert');
        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
        service.post(testinformation);
        expect(basicPostSpy).toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalled();
        expect(alertSpy).toHaveBeenCalledWith('une erreure');
    });
    it('should send a window alert if information name is not valid', () => {
        basicPostSpy = spyOn(requestService, 'basicPost');
        alertSpy = spyOn(window, 'alert');
        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
        service.post(badTestinformation);
        expect(basicPostSpy).not.toHaveBeenCalled();
        expect(confirmSpy).not.toHaveBeenCalled();
        expect(alertSpy).toHaveBeenCalledWith('Il faut choisir respecter les critères pour le tag et le nom');
    });
    it('should send a window alert if information tag is not valid', () => {
        badTestinformation.tags = ['tagggggggggggggg1', 'tg', 'tag ', 'tag!', 'tag', 'tag1'];
        basicPostSpy = spyOn(requestService, 'basicPost');
        alertSpy = spyOn(window, 'alert');
        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
        service.post(badTestinformation);
        expect(basicPostSpy).not.toHaveBeenCalled();
        expect(confirmSpy).not.toHaveBeenCalled();
        expect(alertSpy).toHaveBeenCalledWith('Il faut choisir respecter les critères pour le tag et le nom');
    });

    it('should return an array of tags', () => {
        const stringInput = 'tag,tag,tag';
        const expectedOutput = ['tag', 'tag', 'tag'];
        expect(service.tagsHandler(stringInput)).toEqual(expectedOutput);
    });
    it('should return an empty array', () => {
        const stringInput = '';
        expect(service.tagsHandler(stringInput)).toEqual([]);
    });
});
