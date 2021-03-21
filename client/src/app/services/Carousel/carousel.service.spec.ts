import { TestBed } from '@angular/core/testing';
import { ServerRequestService } from '../index/server-request.service';
import { CarouselService } from './carousel.service';

xdescribe('CarouselService', () => {
    let service: CarouselService;
    let indexServiceSpy: jasmine.SpyObj<ServerRequestService>;

    beforeEach(() => {
        indexServiceSpy = jasmine.createSpyObj('IndexService', ['basicGet']);
        TestBed.configureTestingModule({
            providers: [{ provide: ServerRequestService, useValue: indexServiceSpy }],
        });
        service = TestBed.inject(CarouselService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
