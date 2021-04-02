import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CanvasInformation } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { ServerRequestService } from './server-request.service';

describe('ServerRequestService', () => {
    let httpMock: HttpTestingController;
    let service: ServerRequestService;
    let baseUrl: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(ServerRequestService);
        httpMock = TestBed.inject(HttpTestingController);
        // BASE_URL is private so we need to access it with its name as a key
        // Try to avoid this syntax which violates encapsulation
        // tslint:disable: no-string-literal
        baseUrl = service['BASE_URL'];
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should return expected message (HttpClient called once)', () => {
        const canvasArray: CanvasInformation[] = new Array(1);
        canvasArray[0] = { codeID: 'test' } as CanvasInformation;

        // check the content of the mocked call
        service.basicGet().subscribe((response: HttpResponse<CanvasInformation[]>) => {
            if (response.body != null) {
                expect(response.body).toEqual(canvasArray);
            } else throw new Error();
        });

        const req = httpMock.expectOne(baseUrl + 'metadata');
        expect(req.request.method).toBe('GET');
        // actually send the request
        req.flush(canvasArray);
    });

    it('should return expected message for GetSome (HttpClient called once)', () => {
        const canvasArray: CanvasInformation[] = new Array(1);
        canvasArray[0] = { codeID: 'test', tags: ['test1'] } as CanvasInformation;
        // const expectedMessage: HttpResponse<CanvasInformation[]> = new HttpResponse<CanvasInformation[]>({ body: canvasArray });

        // check the content of the mocked call
        service.getSome('test1').subscribe((response: HttpResponse<CanvasInformation[]>) => {
            if (response.body != null) {
                expect(response.body).toEqual(canvasArray);
            } else throw new Error();
        });

        const req = httpMock.expectOne(baseUrl + 'metadata' + '/test1');
        expect(req.request.method).toBe('GET');
        // actually send the request
        req.flush(canvasArray);
    });

    it('should a message confirmation when sending a POST request (HttpClient called once)', () => {
        const canvas: CanvasInformation = { codeID: 'test' } as CanvasInformation;
        const recieved: Message = { body: 'Hello', title: 'World' };
        // subscribe to the mocked call
        // tslint:disable-next-line: no-empty
        service.basicPost(canvas).subscribe((response: HttpResponse<Message>) => {
            if (response.body != null) {
                expect(response.body).toEqual(recieved);
            } else throw new Error();
        }, fail);

        const req = httpMock.expectOne(baseUrl + 'metadata');
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(recieved);
    });

    it('should a message confirmation when sending a Delete request (HttpClient called once)', () => {
        const recievedMessage: Message = { body: 'Hello', title: 'World' };
        const message = 'testId';
        // subscribe to the mocked call
        // tslint:disable-next-line: no-empty
        service.basicDelete(message).subscribe((response: HttpResponse<Message>) => {
            if (response.body != null) {
                expect(response.body).toEqual(recievedMessage);
            } else throw new Error();
        }, fail);

        const req = httpMock.expectOne(baseUrl + 'metadata' + '/' + message);
        expect(req.request.method).toBe('DELETE');
        // actually send the request
        req.flush(recievedMessage);
    });
});
