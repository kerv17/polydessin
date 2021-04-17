import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import * as Globals from '@app/Constants/constants';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ServerRequestService } from '@app/services/server-request/server-request.service';
import { MainPageComponent } from './main-page.component';

import SpyObj = jasmine.SpyObj;

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let indexServiceSpy: SpyObj<ServerRequestService>;
    let carouselService: CarouselService;
    const router = {
        navigate: jasmine.createSpy('navigate'),
    };

    beforeEach(async(() => {
        carouselService = new CarouselService({} as ServerRequestService, {} as DrawingService, {} as Router);
        indexServiceSpy = jasmine.createSpyObj<ServerRequestService>('ServerRequestService', ['basicGet']);
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [MainPageComponent],
            providers: [
                { provide: ServerRequestService, useValue: indexServiceSpy },
                { provide: Router, useValue: router },
                { provide: CarouselService, useValue: carouselService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should have as title 'LOG2990'", () => {
        expect(component.title).toEqual('LOG2990');
    });

    it('should go to editor ', () => {
        component.goToEditor();

        expect(router.navigate).toHaveBeenCalledWith(['/editor']);
    });
    it('should open the carousel', () => {
        const initialiserSpy = spyOn(component.carouselService, 'initialiserCarousel');
        component.openCarousel();
        expect(initialiserSpy).toHaveBeenCalled();
    });

    it('should call the hostListener with the right hotkey', () => {
        const openSpy = spyOn(component, 'openCarousel');
        const keyEventData = { isTrusted: true, key: Globals.CAROUSEL_SHORTCUT, ctrlKey: true, shiftKey: false };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        window.dispatchEvent(keyDownEvent);
        expect(openSpy).toHaveBeenCalled();
    });

    it('should  not call the hostListener with the right hotkey', () => {
        const openSpy = spyOn(component, 'openCarousel');
        const keyEventData = { isTrusted: true, key: Globals.CRAYON_SHORTCUT, ctrlKey: true, shiftKey: false };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        window.dispatchEvent(keyDownEvent);
        expect(openSpy).not.toHaveBeenCalled();
    });
    it('should go to editor and dispatch an action Event ', () => {
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);
        component.goContinue();
        expect(spyDispatch).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/editor']);
    });
    it('should return the value of canvasExists', () => {
        localStorage.setItem('thereIsSavedDrawing', 'false');
        const result = component.verifDessinExistant();
        expect(result).toEqual(false);
    });
});
