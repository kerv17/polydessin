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
fdescribe('CarouselService', () => {
    let service: CarouselService;
    let indexServiceSpy: jasmine.SpyObj<ServerRequestService>;
    let confirmSpy: jasmine.Spy;
    let getSpy: jasmine.Spy;
    let alertSpy: jasmine.Spy;
    let requestService: ServerRequestService;
    const router = {
        navigate: jasmine.createSpy('navigate'),
    };

    beforeEach(() => {
        indexServiceSpy = jasmine.createSpyObj('IndexService', ['basicGet']);
        requestService = new ServerRequestService({} as HttpClient);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule, CarouselModule],

            providers: [
                { provide: ServerRequestService, useValue: indexServiceSpy },
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
    it('shouldnt delete the current slide if get returns an error', () => {
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

    it('should initialise the carousel and get all the pictures', () => {});
});
