import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ColorSliderComponent } from '@app/components/color/color-slider/color-slider.component';
import { ColorService } from '@app/services/color/color.service';
import { ColorModalComponent } from './color-modal.component';

// Mock pour le colorpalette component
@Component({
    selector: 'app-color-palette',
    template: './color-palette.component.html',
})
class MockColorPaletteComponent {
    @Input()
    hue: string;

    @Input()
    opacity: string;
}

describe('ColorModalComponent', () => {
    let component: ColorModalComponent;
    let fixture: ComponentFixture<ColorModalComponent>;
    let colorService: ColorService;
    let readSpy: jasmine.Spy;
    let confirmSpy: jasmine.Spy;
    let selectedColorSpy: jasmine.Spy;
    let updateSpy: jasmine.Spy;
    let setColorSpy: jasmine.Spy;

    beforeEach(async(() => {
        colorService = new ColorService();
        colorService.currentColor = 'Primary';
        colorService.primaryColor = 'rgba(0,0,0,1)';
        colorService.secondaryColor = 'rgba(0,0,0,1)';
        TestBed.configureTestingModule({
            declarations: [ColorModalComponent, ColorSliderComponent, MockColorPaletteComponent],
            providers: [{ provide: ColorService, useValue: colorService }],
            imports: [FormsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' ngAfterViewInit should call selectedColor', () => {
        selectedColorSpy = spyOn(colorService, 'selectedColor');
        component.ngAfterViewInit();
        expect(selectedColorSpy).toHaveBeenCalled();
    });

    it(' ngAfterViewInit should call setColorInputValue', () => {
        setColorSpy = spyOn(component, 'setColorInputValue');
        component.ngAfterViewInit();
        expect(setColorSpy).toHaveBeenCalled();
    });

    it(' ngAfterViewInit should initialize hue value if color is not black', () => {
        colorService.primaryColor = 'rgba(23,55,ff,1)';
        colorService.currentColor = 'Primary';
        component.ngAfterViewInit();
        expect(component.hue).toEqual(component.color);
    });

    it(' ngAfterViewInit should not initialize hue value if color is black', () => {
        colorService.primaryColor = 'rgba(0,0,0,1)';
        colorService.currentColor = 'Primary';
        component.ngAfterViewInit();
        expect(component.hue).not.toEqual(component.color);
    });

    it('confirmColor should call confirmColorSelection', () => {
        confirmSpy = spyOn(colorService, 'confirmColorSelection');
        component.confirmColor();
        expect(confirmSpy).toHaveBeenCalledWith(component.color);
    });

    it(' confirmColor should emit false as visibility value ', () => {
        const visibilityEmitterSpy = spyOn(component.isVisible, 'emit');
        component.confirmColor();
        expect(visibilityEmitterSpy).toHaveBeenCalledWith(false);
    });

    it(' confirmColor should emit color as color value ', () => {
        const colorEmitterSpy = spyOn(component.colorModified, 'emit');
        component.confirmColor();
        expect(colorEmitterSpy).toHaveBeenCalledWith(component.color);
    });

    it(' cancel should emit false as visibility value ', () => {
        const visibilityEmitterSpy = spyOn(component.isVisible, 'emit');
        component.cancel();
        expect(visibilityEmitterSpy).toHaveBeenCalledWith(false);
    });

    it(' setColorInputValue should set the rgb values to 0 if color is undefined', () => {
        component.setColorInputValue();
        expect(component.rValue).toEqual('0');
        expect(component.gValue).toEqual('0');
        expect(component.bValue).toEqual('0');
    });

    it(' setColorInputValue should call readRGBValues to set the rgb values to the correct value of color', () => {
        component.color = 'rgba(125,43,200,1)';
        readSpy = spyOn(colorService, 'readRGBValues');
        component.setColorInputValue();
        expect(readSpy).toHaveBeenCalledWith(component.color);
    });

    it(' setColorInputValue should set the correct rgb values in hex', () => {
        component.color = 'rgba(225,45,22,0.75)';
        component.setColorInputValue();
        expect(component.rValue).toEqual('e1');
        expect(component.gValue).toEqual('2d');
        expect(component.bValue).toEqual('16');
        expect(component.opacity).toEqual('75');
    });

    it(' updateColorFromInput should call isHexadecimal to verify if value passed is a valid value', () => {
        updateSpy = spyOn(colorService, 'isHexadecimal');
        component.rValue = '23';
        component.gValue = 'fb';
        component.bValue = '00';
        component.updateColorFromInput();
        expect(updateSpy).toHaveBeenCalled();
    });

    it(' updateColorFromInput should update color & hue to correct rgba value if all values provided are hexadecimal ', () => {
        const expectedResult: string = 'rgba(' + parseInt('72', 16) + ',' + parseInt('fb', 16) + ',' + parseInt('aa', 16) + ',0.45)';
        component.rValue = '72';
        component.gValue = 'fb';
        component.bValue = 'aa';
        component.opacity = '45';
        component.updateColorFromInput();
        expect(component.color).toEqual(expectedResult);
        expect(component.hue).toEqual(expectedResult);
    });

    it('omitUnwantedChars should return true if key pressed is a number from 0 to 9', () => {
        const expectedResult = true;
        const keyEvent1 = {
            key: '0',
        } as KeyboardEvent;
        expect(component.omitUnwantedChars(keyEvent1)).toEqual(expectedResult);
        const keyEvent2 = {
            key: '9',
        } as KeyboardEvent;
        expect(component.omitUnwantedChars(keyEvent2)).toEqual(expectedResult);
        const keyEvent3 = {
            key: '5',
        } as KeyboardEvent;
        expect(component.omitUnwantedChars(keyEvent3)).toEqual(expectedResult);
    });

    it('omitUnwantedChars should return false if key pressed is not a number from 0 to 9', () => {
        const expectedResult = false;
        const keyEvent1 = {
            key: '-',
        } as KeyboardEvent;
        expect(component.omitUnwantedChars(keyEvent1)).toEqual(expectedResult);
        const keyEvent2 = {
            key: '!',
        } as KeyboardEvent;
        expect(component.omitUnwantedChars(keyEvent2)).toEqual(expectedResult);
        const keyEvent3 = {
            key: 'b',
        } as KeyboardEvent;
        expect(component.omitUnwantedChars(keyEvent3)).toEqual(expectedResult);
    });

    it('omitUnwantedColorValue should return true if key pressed is a number from 0 to 9 or a lowercase letter from a to f', () => {
        const expectedResult = true;
        const keyEvent1 = {
            key: 'a',
        } as KeyboardEvent;
        expect(component.omitUnwantedColorValue(keyEvent1)).toEqual(expectedResult);
        const keyEvent2 = {
            key: '9',
        } as KeyboardEvent;
        expect(component.omitUnwantedColorValue(keyEvent2)).toEqual(expectedResult);
        const keyEvent3 = {
            key: '5',
        } as KeyboardEvent;
        expect(component.omitUnwantedColorValue(keyEvent3)).toEqual(expectedResult);
    });

    it('omitUnwantedColorValue should return false if key pressed is not a number from 0 to 9 or a lowercase letter from a to f', () => {
        const expectedResult = false;
        const keyEvent1 = {
            key: '!',
        } as KeyboardEvent;
        expect(component.omitUnwantedColorValue(keyEvent1)).toEqual(expectedResult);
        const keyEvent2 = {
            key: 'g',
        } as KeyboardEvent;
        expect(component.omitUnwantedColorValue(keyEvent2)).toEqual(expectedResult);
        const keyEvent3 = {
            key: '-',
        } as KeyboardEvent;
        expect(component.omitUnwantedColorValue(keyEvent3)).toEqual(expectedResult);
    });

    it('verifyMaxOpacity should set opacity to 100 and return false if opacity value input is greater than 100', () => {
        component.opacity = '101';
        expect(component.verifyMaxOpacity()).toEqual(false);
        expect(component.opacity).toEqual('100');
    });

    it('verifyMaxOpacity should return true if opacity value input is not greater than 100', () => {
        component.opacity = '23';
        expect(component.verifyMaxOpacity()).toEqual(true);
        expect(component.opacity).toEqual('23');
    });

    it('opacityIsNotEmpty should set opacity to 100 and return false if opacity input is empty', () => {
        component.opacity = '';
        expect(component.opacityIsNotEmpty()).toEqual(false);
        expect(component.opacity).toEqual('100');
    });

    it('opacityIsNotEmpty should set opacity return true if opacity input is not empty', () => {
        component.opacity = '23';
        expect(component.opacityIsNotEmpty()).toEqual(true);
        expect(component.opacity).toEqual('23');
    });

    it('verifyIfEmpty should set color values to 00 if the inputs are left empty', () => {
        component.rValue = '';
        component.gValue = '';
        component.bValue = '';
        component.verifyIfEmpty();
        expect(component.rValue).toEqual('00');
        expect(component.gValue).toEqual('00');
        expect(component.bValue).toEqual('00');
    });

    it('verifyIfEmpty should call updateColorFromInput', () => {
        updateSpy = spyOn(component, 'updateColorFromInput');
        component.verifyIfEmpty();
        expect(updateSpy).toHaveBeenCalled();
    });

    it('verifyIfEmpty should not change color values if the inputs are not empty', () => {
        component.rValue = '255';
        component.gValue = '67';
        component.bValue = '168';
        component.verifyIfEmpty();
        expect(component.rValue).toEqual('255');
        expect(component.gValue).toEqual('67');
        expect(component.bValue).toEqual('168');
    });
});
