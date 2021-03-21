import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CarouselService } from '@app/services/Carousel/carousel.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ServerRequestService } from '@app/services/index/server-request.service';
import { CarousselComponent } from './caroussel.component';
describe('CarousselComponent', () => {
    let component: CarousselComponent;
    let carouselService: CarouselService;
    let fixture: ComponentFixture<CarousselComponent>;
    let drawingStub: DrawingService;
    const router = jasmine.createSpyObj(Router, ['navigate']);

    beforeEach(async(() => {
        drawingStub = {} as DrawingService;
        carouselService = new CarouselService({} as ServerRequestService, drawingStub, router);
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
