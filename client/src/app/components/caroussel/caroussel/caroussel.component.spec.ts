import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as Globals from '@app/Constants/constants';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PopupService } from '@app/services/modal/popup.service';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
import { SelectionMovementService } from '@app/services/selection-movement/selection-movement.service';
import { SelectionResizeService } from '@app/services/selection-resize/selection-resize.service';
import { ServerRequestService } from '@app/services/server-request/server-request.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { AerosolService } from '@app/services/tools/ToolServices/aerosol-service.service';
import { BucketService } from '@app/services/tools/ToolServices/bucket.service';
import { EllipsisService } from '@app/services/tools/ToolServices/ellipsis-service';
import { LassoService } from '@app/services/tools/ToolServices/lasso.service';
import { LineService } from '@app/services/tools/ToolServices/line-service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { RectangleService } from '@app/services/tools/ToolServices/rectangle-service';
import { SelectionService } from '@app/services/tools/ToolServices/selection.service';
import { StampService } from '@app/services/tools/ToolServices/stamp.service';
import { CanvasInformation } from '@common/communication/canvas-information';
import { CarouselComponent, CarouselModule } from 'ngx-owl-carousel-o';
import { CarousselComponent } from './caroussel.component';
export class CarouselStub {
    // tslint:disable: no-empty
    // tslint:disable: no-any
    next(): void {}
    prev(): void {}
}

describe('CarousselComponent', () => {
    let component: CarousselComponent;
    let controller: ToolControllerService;
    let carouselService: CarouselService;
    let fixture: ComponentFixture<CarousselComponent>;
    let carousel: CarouselStub;
    const drawingStub = new DrawingService({} as ResizePoint);

    const router = jasmine.createSpyObj(Router, ['navigate']);
    const maxItems = 3;

    beforeEach(async(() => {
        carousel = new CarouselStub();
        controller = new ToolControllerService(
            {} as PencilService,
            {} as RectangleService,
            new LineService(drawingStub),
            {} as EllipsisService,
            {} as AerosolService,
            new SelectionService(drawingStub, {} as SelectionMovementService, {} as SelectionResizeService),
            {} as StampService,
            new LassoService(drawingStub, {} as LineService, {} as SelectionService),
            {} as BucketService,
        );
        carouselService = new CarouselService({} as ServerRequestService, drawingStub, router, {} as PopupService);
        TestBed.configureTestingModule({
            imports: [CarouselModule, FormsModule],
            declarations: [CarousselComponent],
            providers: [
                { provide: CarouselService, useValue: carouselService },
                { provide: ToolControllerService, useValue: controller },
            ],
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

    it('should load the carousel Image', () => {
        const onEscapeSpy = spyOn(((component as any).toolController as any).selectionService, 'onEscape').and.returnValue({});
        const lassoEscapeSpy = spyOn(((component as any).toolController as any).lassoService, 'onEscape').and.returnValue({});
        const loadSpy = spyOn((component as any).carouselService, 'loadCanvas').and.returnValue(true);
        const clearPathSpy = spyOn(((component as any).toolController as any).lineService, 'clearPath').and.returnValue({});
        const lassoClearPathSpy = spyOn(((component as any).toolController as any).lassoService, 'clearPath').and.returnValue({});

        component.loadCarouselImage({} as CanvasInformation);
        expect(onEscapeSpy).toHaveBeenCalled();
        expect(loadSpy).toHaveBeenCalled();
        expect(clearPathSpy).toHaveBeenCalled();
        expect(lassoEscapeSpy).toHaveBeenCalled();
        expect(lassoClearPathSpy).toHaveBeenCalled();
    });

    it('should load the carousel Image if load Carousel returns false', () => {
        const onEscapeSpy = spyOn(((component as any).toolController as any).selectionService, 'onEscape').and.returnValue({});
        const lassoEscapeSpy = spyOn(((component as any).toolController as any).lassoService, 'onEscape').and.returnValue({});
        const loadSpy = spyOn((component as any).carouselService, 'loadCanvas').and.returnValue(false);
        const clearPathSpy = spyOn(((component as any).toolController as any).lineService, 'clearPath').and.returnValue({});
        const lassoClearPathSpy = spyOn(((component as any).toolController as any).lassoService, 'clearPath').and.returnValue({});

        component.loadCarouselImage({} as CanvasInformation);
        expect(onEscapeSpy).toHaveBeenCalled();
        expect(loadSpy).toHaveBeenCalled();
        expect(clearPathSpy).not.toHaveBeenCalled();
        expect(lassoEscapeSpy).toHaveBeenCalled();
        expect(lassoClearPathSpy).not.toHaveBeenCalled();
    });
});
