import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorService } from '@app/services/color/color.service';
import { ColorModalComponent } from './color-modal.component';

describe('ColorModalComponent', () => {
    let component: ColorModalComponent;
    let fixture: ComponentFixture<ColorModalComponent>;
    let colorService: ColorService;
    let verifySpy: jasmine.Spy;
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
            declarations: [ColorModalComponent],
            providers: [{ provide: ColorService, useValue: colorService }],
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

    it(' confirmColor emits false as visibility value ', () => {
        const visibilityEmitterSpy = spyOn(component.isVisible, 'emit');
        component.confirmColor();
        expect(visibilityEmitterSpy).toHaveBeenCalledWith(false);
    });

    it(' confirmColor emits color as color value ', () => {
        const colorEmitterSpy = spyOn(component.colorModified, 'emit');
        component.confirmColor();
        expect(colorEmitterSpy).toHaveBeenCalledWith(component.color);
    });

    it(' cancel emits false as visibility value ', () => {
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

    it(' updateColorFromInput should call setColorInputValue if rgb values are not all hexadecimal ', () => {
        setColorSpy = spyOn(component, 'updateColorFromInput');
        component.rValue = 'gg';
        component.gValue = '345';
        component.bValue = '00';
        component.updateColorFromInput();
        expect(setColorSpy).toHaveBeenCalled();
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

    it('updateOpacity should call verifyOpacityInput', () => {
        component.opacity = '75';
        verifySpy = spyOn(colorService, 'verifyOpacityInput');
        component.updateOpacity();
        expect(verifySpy).toHaveBeenCalledWith(component.opacity);
    });

    it('updateOpacity should set opacity value to 100 if the returned opacity is 1', () => {
        component.opacity = '900';
        component.updateOpacity();
        expect(component.opacity).toEqual('100');
    });

    it('updateOpacity should call updateColorFromInput', () => {
        component.opacity = '75';
        updateSpy = spyOn(component, 'updateColorFromInput');
        component.updateOpacity();
        expect(updateSpy).toHaveBeenCalled();
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
});
