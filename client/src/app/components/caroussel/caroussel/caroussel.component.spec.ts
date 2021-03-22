import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import * as Globals from '@app/Constants/constants';
import { CarouselService } from '@app/services/Carousel/carousel.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ServerRequestService } from '@app/services/index/server-request.service';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
import { CarousselComponent } from './caroussel.component';

describe('CarousselComponent', () => {
    let component: CarousselComponent;
    let carouselService: CarouselService;
    let fixture: ComponentFixture<CarousselComponent>;
    const drawingStub = new DrawingService({} as ResizePoint);

    const router = jasmine.createSpyObj(Router, ['navigate']);
    const maxItems = 3;

    beforeEach(async(() => {
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

    it('should reset all carousel options and set the number of items per slide to 3  if pictures is longer than three', () => {
        const bigSize = 8;
        component.carouselService.pictures = new Array(bigSize);
        component.resetOptions();
        expect(component.customOptions.items).toEqual(maxItems);
    });
    it('should reset all carousel options and set the number of items per slide to 1  if pictures is shorter than three', () => {
        const smallNumber = 2;
        component.carouselService.pictures = new Array(smallNumber);
        component.resetOptions();
        expect(component.customOptions.items).not.toEqual(maxItems);
    });

    it('rotate the canvas on right arrow click', () => {
        const keyEventData = { isTrusted: true, key: Globals.RIGHT_ARROW_SHORTCUT, ctrlKey: false, shiftKey: false };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        const nextSpy = spyOn(component.owlCar, 'next');
        window.dispatchEvent(keyDownEvent);

        expect(nextSpy).toHaveBeenCalled();
    });

    it('rotate the canvas on left arrow click', () => {
        const keyEventData = { isTrusted: true, key: Globals.LEFT_ARROW_SHORTCUT, ctrlKey: false, shiftKey: false };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        const nextSpy = spyOn(component.owlCar, 'prev');

        window.dispatchEvent(keyDownEvent);
        expect(nextSpy).toHaveBeenCalled();
    });
});
