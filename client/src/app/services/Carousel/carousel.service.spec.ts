import { HttpClient, HttpClientModule, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ServerRequestService } from '@app/services/index/server-request.service';
import { CanvasInformation } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { of, throwError } from 'rxjs';
// import { SlideModel } from '../../../../node_modules/ngx-owl-carousel-o/lib/models/slide.model';
import { CarouselService } from './carousel.service';
export class SlideModel {
    id: string;
} // tslint:disable: no-any
describe('CarouselService', () => {
    let service: CarouselService;

    let confirmSpy: jasmine.Spy;
    let getSpy: jasmine.Spy;
    let alertSpy: jasmine.Spy;
    let requestService: ServerRequestService;

    beforeEach(() => {
        requestService = new ServerRequestService({} as HttpClient);
        const router = {
            navigate: jasmine.createSpy('navigate'),
        };
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule, CarouselModule],

            providers: [
                { provide: ServerRequestService, useValue: requestService },
                { provide: Router, useValue: router },
                {
                    provide: ServerRequestService,
                    useValue: requestService,
                },
            ],
        });
        service = TestBed.inject(CarouselService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should close the carousel', () => {
        service.showCarousel = true;
        service.close();
        expect(service.showCarousel).not.toBeTrue();
    });
    it('should delete the current slide', () => {
        const slideArray: SlideModel[] = new Array(1);
        service.pictures = new Array(0);
        slideArray[0] = new SlideModel();
        slideArray[0].id = 'test';
        const removeCanvasSpy = spyOn(service, 'removeCanvasInformation');
        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
        const message = { title: 'test' } as Message;
        const response: HttpResponse<Message> = new HttpResponse<Message>({ body: message });
        // tslint:disable-next-line: no-any
        getSpy = spyOn((service as any).requestService, 'basicDelete').and.returnValue(of(response));
        alertSpy = spyOn(window, 'alert');
        service.delete(slideArray);
        expect(confirmSpy).toHaveBeenCalled();
        expect(getSpy).toHaveBeenCalled();
        expect(removeCanvasSpy).toHaveBeenCalled();
        expect(alertSpy).toHaveBeenCalledTimes(2);
    });

    it('should delete the current slide with an active slide set to 1', () => {
        const slideArray: SlideModel[] = new Array(2);
        service.pictures = new Array(1);
        slideArray[1] = new SlideModel();
        slideArray[1].id = 'test';
        const removeCanvasSpy = spyOn(service, 'removeCanvasInformation');
        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);

        const response: HttpResponse<Message> = new HttpResponse<Message>({ body: null });
        // tslint:disable-next-line: no-any
        getSpy = spyOn((service as any).requestService, 'basicDelete').and.returnValue(of(response));
        alertSpy = spyOn(window, 'alert');
        service.delete(slideArray);
        expect(confirmSpy).toHaveBeenCalled();
        expect(getSpy).toHaveBeenCalled();
        expect(removeCanvasSpy).toHaveBeenCalled();
        expect(alertSpy).toHaveBeenCalledTimes(1);
    });

    it('shouldnt delete the current slide if confirm returns false', () => {
        const slideArray: SlideModel[] = new Array(1);
        service.pictures = new Array(0);
        slideArray[0] = new SlideModel();
        slideArray[0].id = 'test';
        const removeCanvasSpy = spyOn(service, 'removeCanvasInformation');
        confirmSpy = spyOn(window, 'confirm').and.returnValue(false);
        const message = { title: 'test' } as Message;
        const response: HttpResponse<Message> = new HttpResponse<Message>({ body: message });
        // tslint:disable-next-line: no-any
        getSpy = spyOn((service as any).requestService, 'basicDelete').and.returnValue(of(response));
        alertSpy = spyOn(window, 'alert');
        service.delete(slideArray);
        expect(confirmSpy).toHaveBeenCalled();
        expect(getSpy).not.toHaveBeenCalled();
        expect(removeCanvasSpy).not.toHaveBeenCalled();
        expect(alertSpy).not.toHaveBeenCalled();
    });
    it('shouldnt delete the current slide if delete returns an error', () => {
        const slideArray: SlideModel[] = new Array(1);
        service.pictures = new Array(0);
        slideArray[0] = new SlideModel();
        slideArray[0].id = 'test';
        const removeCanvasSpy = spyOn(service, 'removeCanvasInformation');
        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
        const handleSpy = spyOn(service, 'handleCarouselErrors').and.returnValue();
        const response: HttpErrorResponse = new HttpErrorResponse({});
        // tslint:disable-next-line: no-any
        getSpy = spyOn((service as any).requestService, 'basicDelete').and.returnValue(throwError(response));

        alertSpy = spyOn(window, 'alert');
        service.delete(slideArray);
        expect(confirmSpy).toHaveBeenCalled();
        expect(getSpy).toHaveBeenCalled();
        expect(removeCanvasSpy).not.toHaveBeenCalled();
        expect(handleSpy).toHaveBeenCalled();
    });

    it('should do nothing  if slide model is undefined', () => {
        service.pictures = new Array(0);

        const removeCanvasSpy = spyOn(service, 'removeCanvasInformation');
        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
        const handleSpy = spyOn(service, 'handleCarouselErrors').and.returnValue();
        const response: HttpErrorResponse = new HttpErrorResponse({});

        getSpy = spyOn((service as any).requestService, 'basicDelete').and.returnValue(throwError(response));

        alertSpy = spyOn(window, 'alert');
        service.delete(undefined);
        expect(confirmSpy).not.toHaveBeenCalled();
        expect(getSpy).not.toHaveBeenCalled();
        expect(removeCanvasSpy).not.toHaveBeenCalled();
        expect(handleSpy).not.toHaveBeenCalled();
    });
    it('should remove canvas information', () => {
        const arraySize = 10;
        service.pictures = new Array(arraySize);
        for (let i = 0; i < arraySize; i++) {
            service.pictures[i] = { codeID: i.toString() } as CanvasInformation;
        }
        service.removeCanvasInformation('0');
        expect(service.pictures[0].codeID).toEqual((arraySize - 1).toString());
        expect(service.pictures.length).toEqual(arraySize - 1);
    });

    it('should load the Canvas from the canvas information', () => {
        const loadCanvasSpy = spyOn((service as any).drawingService, 'loadOldCanvas').and.returnValue({});
        (service as any).router.url = '/editor';

        service.loadCanvas({} as CanvasInformation);
        expect(loadCanvasSpy).toHaveBeenCalled();
        expect((service as any).router.navigate).not.toHaveBeenCalled();
    });

    it('should not load the Canvas from the canvas information if it isnt on editor page', () => {
        const loadCanvasSpy = spyOn((service as any).drawingService, 'loadOldCanvas').and.returnValue({});
        (service as any).router.url = ' ';

        service.loadCanvas({} as CanvasInformation);
        expect(loadCanvasSpy).not.toHaveBeenCalled();
        expect((service as any).router.navigate).toHaveBeenCalled();
    });

    it('should initialise the carousel and get all the pictures', () => {
        service.currentSearch = 'test';
        service.currentTags = 'test';
        const canvasArray: CanvasInformation[] = new Array(1);
        canvasArray[0] = {} as CanvasInformation;
        const getImagesSpy = spyOn(service, 'getImages').and.returnValue();
        const response: HttpResponse<CanvasInformation[]> = new HttpResponse<CanvasInformation[]>({ body: canvasArray });
        getSpy = spyOn((service as any).requestService, 'basicGet').and.returnValue(of(response));
        service.initialiserCarousel();
        expect(getImagesSpy).toHaveBeenCalled();
        expect(service.currentTags).toEqual('');
        expect(service.currentSearch).toEqual('');
    });

    it('should initialise the carousel and get all the pictures', () => {
        const getImagesSpy = spyOn(service, 'getImages').and.returnValue();

        const errorResponse: HttpErrorResponse = new HttpErrorResponse({});
        getSpy = spyOn((service as any).requestService, 'basicGet').and.returnValue(throwError(errorResponse));
        const handleSpy = spyOn(service, 'handleCarouselErrors').and.returnValue();
        service.initialiserCarousel();
        expect(getImagesSpy).not.toHaveBeenCalled();
        expect(handleSpy).toHaveBeenCalled();
    });

    it('should set the slides', () => {
        const arraySize = 10;
        service.pictures = new Array(arraySize);
        for (let i = 0; i < arraySize; i++) {
            service.pictures[i] = { codeID: i.toString(), format: 'png' } as CanvasInformation;
        }
        service.setSlides();
        for (const element of service.pictures) {
            expect(element.imageData.includes('data:image/png')).toBeTrue();
        }
    });

    it('should be able to filter the canvas', () => {
        service.currentTags = 'test';
        const canvasArray: CanvasInformation[] = new Array(1);
        canvasArray[0] = {} as CanvasInformation;
        const response: HttpResponse<CanvasInformation[]> = new HttpResponse<CanvasInformation[]>({ body: canvasArray });
        const getImagesSpy = spyOn(service, 'getImages').and.returnValue();
        getSpy = spyOn((service as any).requestService, 'getSome').and.returnValue(of(response));
        service.filterdessin();
        expect(getImagesSpy).toHaveBeenCalled();
        expect(service.currentTags).toEqual(service.currentSearch);
        expect(getSpy).toHaveBeenCalled();
    });

    it('should be able to filter the canvas', () => {
        service.currentTags = 'test';
        service.currentSearch = 'test';
        const canvasArray: CanvasInformation[] = new Array(1);
        canvasArray[0] = {} as CanvasInformation;
        const handleSpy = spyOn(service, 'handleCarouselErrors').and.returnValue();
        const errorResponse: HttpErrorResponse = new HttpErrorResponse({});
        getSpy = spyOn((service as any).requestService, 'getSome').and.returnValue(throwError(errorResponse));
        const getImagesSpy = spyOn(service, 'getImages').and.returnValue();

        service.filterdessin();
        expect(getImagesSpy).not.toHaveBeenCalled();
        expect(service.currentTags).not.toEqual(service.currentSearch);
        expect(getSpy).toHaveBeenCalled();
        expect(handleSpy).toHaveBeenCalled();
    });

    it('should show the Error Response', () => {
        const errorResponse: HttpErrorResponse = new HttpErrorResponse({ status: 404, error: 'test' });
        const windowSpy = spyOn(window, 'alert');
        service.handleCarouselErrors(errorResponse);
        expect(windowSpy).toHaveBeenCalledWith(errorResponse.error);
    });

    it('should show the Error Response', () => {
        const errorResponse: HttpErrorResponse = new HttpErrorResponse({ status: 0, error: 'test' });
        const windowSpy = spyOn(window, 'alert');
        service.handleCarouselErrors(errorResponse);
        expect(windowSpy).toHaveBeenCalledWith('Aucune connection avec le serveur');
    });
    it('should show the Error Response', () => {
        const errorResponse: HttpErrorResponse = new HttpErrorResponse({ status: 10, error: 'test' });
        const windowSpy = spyOn(window, 'alert');
        service.handleCarouselErrors(errorResponse);
        expect(windowSpy).not.toHaveBeenCalledWith('Aucune connection avec le serveur');
        expect(windowSpy).not.toHaveBeenCalledWith(errorResponse.error);
    });
    it('should get the images from the HttpResponse', () => {
        const canvasArray: CanvasInformation[] = new Array(1);
        canvasArray[0] = {} as CanvasInformation;
        const response: HttpResponse<CanvasInformation[]> = new HttpResponse<CanvasInformation[]>({ body: canvasArray });
        service.getImages(response);
        expect(service.pictures).toEqual(canvasArray);
    });
    it('shouldnt get the images from the HttpResponse if the body is null', () => {
        const canvasArray: CanvasInformation[] = new Array(1);
        canvasArray[0] = {} as CanvasInformation;
        service.pictures = canvasArray;
        const response: HttpResponse<CanvasInformation[]> = new HttpResponse<CanvasInformation[]>({ body: null });
        service.getImages(response);
        expect(service.pictures).toEqual(canvasArray);
    });
});
