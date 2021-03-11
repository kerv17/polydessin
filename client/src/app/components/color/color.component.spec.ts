import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '@app/Constants/constants';
import { ColorService } from '@app/services/color/color.service';
import { ColorModalComponent } from './color-modal/color-modal.component';
import { ColorComponent } from './color.component';

describe('ColorComponent', () => {
    let component: ColorComponent;
    let mouseEvent: MouseEvent;
    let fixture: ComponentFixture<ColorComponent>;
    let colorService: ColorService;
    let saveColorSpy: jasmine.Spy;
    let updateSpy: jasmine.Spy;

    beforeEach(async(() => {
        colorService = new ColorService();
        TestBed.configureTestingModule({
            declarations: [ColorComponent, ColorModalComponent],
            providers: [{ provide: ColorService, useValue: colorService }],
        }).compileComponents();

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 1,
        } as MouseEvent;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('get visibility should return the visibility value from the colorService', () => {
        colorService.modalVisibility = true;
        expect(component.visibility).toEqual(true);
        colorService.modalVisibility = false;
        expect(component.visibility).toEqual(false);
    });

    it('ngAfterViewInit should call updateColor', () => {
        updateSpy = spyOn(component, 'updateColor');
        component.ngAfterViewInit();
        expect(updateSpy).toHaveBeenCalled();
    });

    it('ngAfterViewInit should initialize visibility value & recentColors', () => {
        colorService.modalVisibility = true;
        colorService.recentColors = ['rgba(0,0,0,1)', 'rgba(34,ff,cc,1)'];
        component.ngAfterViewInit();
        expect(component.visibility).toEqual(colorService.modalVisibility);
        expect(component.recentColors).toEqual(colorService.recentColors);
    });

    it('ngOnChanges should call updateColor if reset boolean value has changed', () => {
        updateSpy = spyOn(component, 'updateColor');
        component.ngOnChanges({
            reset: new SimpleChange(false, true, true),
        });
        fixture.detectChanges();
        expect(updateSpy).toHaveBeenCalled();
    });

    it('ngOnChanges should not call updateColor if reset boolean value has not changed', () => {
        updateSpy = spyOn(component, 'updateColor');
        component.ngOnChanges({});
        fixture.detectChanges();
        expect(updateSpy).not.toHaveBeenCalled();
    });

    it(' invert should swap primaryColor value with secondaryColor value if color modal is not open', () => {
        colorService.modalVisibility = false;
        component.primaryColor = 'rgba(23,4,56,1)';
        component.secondaryColor = 'rgba(5,78,fa,0.5)';
        component.invert();
        expect(component.primaryColor).toEqual('rgba(5,78,fa,0.5)');
        expect(component.secondaryColor).toEqual('rgba(23,4,56,1)');
        expect(colorService.primaryColor).toEqual('rgba(5,78,fa,0.5)');
        expect(colorService.secondaryColor).toEqual('rgba(23,4,56,1)');
    });

    it(' invert should not swap primaryColor value with secondaryColor value if color modal is currently open', () => {
        colorService.modalVisibility = true;
        component.primaryColor = 'rgba(23,4,56,1)';
        component.secondaryColor = 'rgba(5,78,fa,0.5)';
        component.invert();
        expect(component.primaryColor).toEqual('rgba(23,4,56,1)');
        expect(component.secondaryColor).toEqual('rgba(5,78,fa,0.5)');
    });

    it(' openModal should toggle visibility attribute to true if modal was not open', () => {
        colorService.modalVisibility = false;
        component.openModal(PRIMARY_COLOR);
        expect(colorService.modalVisibility).toEqual(true);
    });

    it(' openModal should retrieve which color was clicked if modal was not open', () => {
        colorService.modalVisibility = false;
        component.openModal(PRIMARY_COLOR);
        expect(colorService.currentColor).toEqual(PRIMARY_COLOR);
    });

    it(' openModal should not retrieve which color was clicked if modal is already open', () => {
        colorService.modalVisibility = true;
        colorService.currentColor = SECONDARY_COLOR;
        component.openModal(PRIMARY_COLOR);
        expect(colorService.currentColor).not.toEqual(PRIMARY_COLOR);
    });

    it(' closeModal should toggle visibility attribute to false ', () => {
        component.closeModal();
        expect(component.visibility).toEqual(false);
        expect(colorService.modalVisibility).toEqual(false);
    });

    it(' updateColor should initialise the color values ', () => {
        colorService.primaryColor = 'rgba(23,4,56,1)';
        colorService.secondaryColor = 'rgba(5,78,fa,0.5)';
        component.updateColor();
        expect(component.primaryColor).toEqual('rgba(23,4,56,1)');
        expect(component.secondaryColor).toEqual('rgba(5,78,fa,0.5)');
    });

    it(' selectPrimaryColor should call saveColor if modalVisibility is false', () => {
        colorService.modalVisibility = false;
        saveColorSpy = spyOn(colorService, 'saveColor');
        component.selectPrimaryColor('rgba(23,4,56,1)');
        expect(saveColorSpy).toHaveBeenCalled();
    });

    it(' selectPrimaryColor should not call saveColor if modalVisibility is true', () => {
        colorService.modalVisibility = true;
        saveColorSpy = spyOn(colorService, 'saveColor');
        component.selectPrimaryColor('rgba(23,4,56,1)');
        expect(saveColorSpy).not.toHaveBeenCalled();
    });

    it(' selectSecondaryColor should call saveColor if modalVisibility is false', () => {
        colorService.modalVisibility = false;
        saveColorSpy = spyOn(colorService, 'saveColor');
        component.selectSecondaryColor('rgba(23,4,56,1)', mouseEvent);
        expect(saveColorSpy).toHaveBeenCalled();
    });

    it(' selectSecondaryColor should call saveColor if modalVisibility is true', () => {
        colorService.modalVisibility = true;
        saveColorSpy = spyOn(colorService, 'saveColor');
        component.selectSecondaryColor('rgba(23,4,56,1)', mouseEvent);
        expect(saveColorSpy).not.toHaveBeenCalled();
    });

    it(' selectPrimaryColor should update the primary color value if modalVisibility is false', () => {
        colorService.modalVisibility = false;
        component.selectPrimaryColor('rgba(23,4,56,1)');
        expect(component.primaryColor).toEqual('rgba(23,4,56,1)');
        expect(colorService.primaryColor).toEqual('rgba(23,4,56,1)');
    });

    it(' selectPrimaryColor should not update the primary color value if modalVisibility is true', () => {
        colorService.modalVisibility = true;
        component.selectPrimaryColor('rgba(23,4,56,1)');
        expect(component.primaryColor).not.toEqual('rgba(23,4,56,1)');
        expect(colorService.primaryColor).not.toEqual('rgba(23,4,56,1)');
    });

    it(' selectSecondaryColor should update the secondary color value if modalVisibility is false', () => {
        colorService.modalVisibility = false;
        component.selectSecondaryColor('rgba(5,78,fa,0.5)', mouseEvent);
        expect(component.secondaryColor).toEqual('rgba(5,78,fa,0.5)');
        expect(colorService.secondaryColor).toEqual('rgba(5,78,fa,0.5)');
    });

    it(' selectSecondaryColor should not update the secondary color value if modalVisibility is true', () => {
        colorService.modalVisibility = true;
        component.selectSecondaryColor('rgba(5,78,fa,0.5)', mouseEvent);
        expect(component.secondaryColor).not.toEqual('rgba(5,78,fa,0.5)');
        expect(colorService.secondaryColor).not.toEqual('rgba(5,78,fa,0.5)');
    });

    it(' selectSecondaryColor should always return false', () => {
        colorService.modalVisibility = true;
        expect(component.selectSecondaryColor('rgba(5,78,fa,0.5)', mouseEvent)).toEqual(false);
        colorService.modalVisibility = false;
        expect(component.selectSecondaryColor('rgba(5,78,fa,0.5)', mouseEvent)).toEqual(false);
    });
});
