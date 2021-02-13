import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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

    it(' invert should swap primaryColor value with secondaryColor value ', () => {
        component.primaryColor = 'rgba(23,4,56,1)';
        component.secondaryColor = 'rgba(5,78,fa,0.5)';
        component.invert();
        expect(component.primaryColor).toEqual('rgba(5,78,fa,0.5)');
        expect(component.secondaryColor).toEqual('rgba(23,4,56,1)');
    });

    it(' invert should update primaryColor & secondaryColor value with correct values ', () => {
        component.primaryColor = 'rgba(23,4,56,1)';
        component.secondaryColor = 'rgba(5,78,fa,0.5)';
        component.invert();
        expect(colorService.primaryColor).toEqual('rgba(5,78,fa,0.5)');
        expect(colorService.secondaryColor).toEqual('rgba(23,4,56,1)');
    });

    it(' openModal should toggle visibility attribute to true ', () => {
        const colorType = 'Primary';
        component.openModal(colorType);
        expect(colorService.modalVisibility).toEqual(true);
    });

    it(' openModal should retrieve which color was clicked ', () => {
        const colorType = 'Primary';
        component.openModal(colorType);
        expect(colorService.currentColor).toEqual(colorType);
    });

    it(' closeModal should toggle visibility attribute to false ', () => {
        component.closeModal();
        expect(component.visibility).toEqual(false);
    });

    it(' updateColor should initialise the color values ', () => {
        colorService.primaryColor = 'rgba(23,4,56,1)';
        colorService.secondaryColor = 'rgba(5,78,fa,0.5)';
        component.updateColor();
        expect(component.primaryColor).toEqual('rgba(23,4,56,1)');
        expect(component.secondaryColor).toEqual('rgba(5,78,fa,0.5)');
    });

    it(' selectPrimaryColor should call saveColor ', () => {
        saveColorSpy = spyOn(colorService, 'saveColor');
        component.selectPrimaryColor('rgba(23,4,56,1)');
        expect(saveColorSpy).toHaveBeenCalled();
    });

    it(' selectSecondaryColor should call saveColor ', () => {
        saveColorSpy = spyOn(colorService, 'saveColor');
        component.selectSecondaryColor('rgba(23,4,56,1)', mouseEvent);
        expect(saveColorSpy).toHaveBeenCalled();
    });

    it(' selectPrimaryColor should update the primary color value ', () => {
        component.selectPrimaryColor('rgba(23,4,56,1)');
        expect(component.primaryColor).toEqual('rgba(23,4,56,1)');
        expect(colorService.primaryColor).toEqual('rgba(23,4,56,1)');
    });

    it(' selectSecondaryColor should update the secondary color value ', () => {
        component.selectSecondaryColor('rgba(5,78,fa,0.5)', mouseEvent);
        expect(component.secondaryColor).toEqual('rgba(5,78,fa,0.5)');
        expect(colorService.secondaryColor).toEqual('rgba(5,78,fa,0.5)');
    });
});
