import { TestBed } from '@angular/core/testing';
import { IndexService } from '../index/index.service';
import { CarouselService } from './carousel.service';

describe('CarouselService', () => {
    let service: CarouselService;
    let indexServiceSpy: jasmine.SpyObj<IndexService>;

    beforeEach(() => {
        indexServiceSpy = jasmine.createSpyObj('IndexService', ['basicGet']);
        TestBed.configureTestingModule({
            providers: [{ provide: IndexService, useValue: indexServiceSpy }],
        });
        service = TestBed.inject(CarouselService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
