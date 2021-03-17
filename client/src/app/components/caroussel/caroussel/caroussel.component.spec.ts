import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselService } from '@app/services/Carousel/carousel.service';
import { IndexService } from '@app/services/index/index.service';
import { CarousselComponent } from './caroussel.component';

describe('CarousselComponent', () => {
    let component: CarousselComponent;
    let carouselService: CarouselService;
    let fixture: ComponentFixture<CarousselComponent>;

    beforeEach(async(() => {
        carouselService = new CarouselService({} as IndexService);
        TestBed.configureTestingModule({
            declarations: [CarousselComponent],
            providers: [{ provide: CarouselService, useValue: carouselService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CarousselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
