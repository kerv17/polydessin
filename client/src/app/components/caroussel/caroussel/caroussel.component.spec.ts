import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as Globals from '@app/Constants/constants';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PopupService } from '@app/services/modal/popup.service';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
import { ServerRequestService } from '@app/services/server-request/server-request.service';
import { CarouselComponent, CarouselModule } from 'ngx-owl-carousel-o';
import { CarousselComponent } from './caroussel.component';
export class CarouselStub {
    // tslint:disable: no-empty
    next(): void {}
    prev(): void {}
}

describe('CarousselComponent', () => {
    let component: CarousselComponent;
    let carouselService: CarouselService;
    let fixture: ComponentFixture<CarousselComponent>;
    let carousel: CarouselStub;
    const drawingStub = new DrawingService({} as ResizePoint);

    const router = jasmine.createSpyObj(Router, ['navigate']);
    const maxItems = 3;

    beforeEach(async(() => {
        carousel = new CarouselStub();
        carouselService = new CarouselService({} as ServerRequestService, drawingStub, router, {} as PopupService);
        TestBed.configureTestingModule({
            imports: [CarouselModule, FormsModule],
            declarations: [CarousselComponent],
            providers: [{ provide: CarouselService, useValue: carouselService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CarousselComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
        fixture.debugElement.nativeElement.style.visibility = 'hidden';
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
        component.owlCar = carousel as CarouselComponent;
        const rightSpy = spyOn(component.owlCar, 'next');
        const leftSpy = spyOn(component.owlCar, 'prev');
        const keyEventData = { isTrusted: true, key: Globals.RIGHT_ARROW_SHORTCUT, ctrlKey: false, shiftKey: false };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);

        window.dispatchEvent(keyDownEvent);
        expect(rightSpy).toHaveBeenCalled();
        expect(leftSpy).not.toHaveBeenCalled();
    });

    it('rotate the canvas on left arrow click', () => {
        component.owlCar = carousel as CarouselComponent;
        const leftSpy = spyOn(component.owlCar, 'prev');
        const rightSpy = spyOn(component.owlCar, 'next');
        const keyEventData = { isTrusted: true, key: Globals.LEFT_ARROW_SHORTCUT, ctrlKey: false, shiftKey: false };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);

        window.dispatchEvent(keyDownEvent);
        expect(leftSpy).toHaveBeenCalled();
        expect(rightSpy).not.toHaveBeenCalled();
    });
    it('does nothing on another KeyDown', () => {
        component.owlCar = carousel as CarouselComponent;
        const rightSpy = spyOn(component.owlCar, 'next');
        const leftSpy = spyOn(component.owlCar, 'prev');
        const keyEventData = { isTrusted: true, key: Globals.NEW_DRAWING_EVENT, ctrlKey: false, shiftKey: false };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);

        window.dispatchEvent(keyDownEvent);
        expect(leftSpy).not.toHaveBeenCalled();
        expect(rightSpy).not.toHaveBeenCalled();
    });
});
