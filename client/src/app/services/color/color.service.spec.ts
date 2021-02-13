import { TestBed } from '@angular/core/testing';
import { ColorService } from './color.service';

describe('ColorService', () => {
    let service: ColorService;
    let saveColorSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ColorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' isHexadecimal should return true if color string is hexadecimal', () => {
        const expectedResult = true;
        let color = 'ff';
        expect(service.isHexadecimal(color)).toEqual(expectedResult);
        color = '0';
        expect(service.isHexadecimal(color)).toEqual(expectedResult);
        color = 'a5';
        expect(service.isHexadecimal(color)).toEqual(expectedResult);
    });

    it(' isHexadecimal should return false if color string is not hexadecimal', () => {
        const expectedResult = false;
        let color = 'g';
        expect(service.isHexadecimal(color)).toEqual(expectedResult);
        color = '-23';
        expect(service.isHexadecimal(color)).toEqual(expectedResult);
        color = '!';
        expect(service.isHexadecimal(color)).toEqual(expectedResult);
        color = '222';
        expect(service.isHexadecimal(color)).toEqual(expectedResult);
    });

    it(' saveColor should add color to recentColors array if there is less than 10 recent colors', () => {
        const expectedResult: string[] = ['rgba(0,0,0,1)', 'rgba(2a,bc,34,1)', 'rgba(21,3,7,0)'];
        const color = 'rgba(21,3,7,0)';
        service.recentColors = ['rgba(0,0,0,1)', 'rgba(2a,bc,34,1)'];
        service.saveColor(color);
        expect(service.recentColors).toEqual(expectedResult);
    });

    it(' saveColor should erase the first color and add the most recent color if there is already 10 colors saved', () => {
        const expectedResult: string[] = [
            'rgba(0,0,0,1)',
            'rgba(2a,bc,34,1)',
            'rgba(21,3,7,0)',
            'rgba(0,0,0,1)',
            'rgba(0,0,0,1)',
            'rgba(0,0,0,1)',
            'rgba(0,0,0,1)',
            'rgba(0,0,0,1)',
            'rgba(0,0,0,1)',
            'rgba(0,0,0,1)',
        ];
        const color = 'rgba(0,0,0,1)';
        service.recentColors = [
            'rgba(1,1,1,1)',
            'rgba(0,0,0,1)',
            'rgba(2a,bc,34,1)',
            'rgba(21,3,7,0)',
            'rgba(0,0,0,1)',
            'rgba(0,0,0,1)',
            'rgba(0,0,0,1)',
            'rgba(0,0,0,1)',
            'rgba(0,0,0,1)',
            'rgba(0,0,0,1)',
        ];
        service.saveColor(color);
        expect(service.recentColors).toEqual(expectedResult);
    });

    it('selectedColor should return the primaryColor if it was selected', () => {
        service.primaryColor = 'rgba(125,43,100,1)';
        service.currentColor = 'Primary';
        expect(service.selectedColor()).toEqual(service.primaryColor);
    });

    it('selectedColor should return the secondaryColor if it was selected', () => {
        service.secondaryColor = 'rgba(90,56,235,1)';
        service.currentColor = 'Secondary';
        expect(service.selectedColor()).toEqual(service.secondaryColor);
    });

    it('selectedColor should return empty string if there was an error in the selection', () => {
        service.primaryColor = 'rgba(55,34,78,1)';
        service.secondaryColor = 'rgba(25,200,125,1)';
        service.currentColor = 'Second';
        expect(service.selectedColor()).not.toEqual(service.secondaryColor);
        expect(service.selectedColor()).not.toEqual(service.primaryColor);
        expect(service.selectedColor()).toEqual('');
        service.currentColor = 'test';
        expect(service.selectedColor()).not.toEqual(service.secondaryColor);
        expect(service.selectedColor()).not.toEqual(service.primaryColor);
        expect(service.selectedColor()).toEqual('');
    });

    it('confirmColorSelection should call saveColor with the given color if the Primary color has changed', () => {
        saveColorSpy = spyOn(service, 'saveColor');
        service.currentColor = 'Primary';
        service.primaryColor = 'rgba(0,0,0,1)';
        service.confirmColorSelection('rgba(43,43,125,1)');
        expect(saveColorSpy).toHaveBeenCalledWith('rgba(0,0,0,1)');
    });

    it('confirmColorSelection should call saveColor with the given color if the Secondary color has changed', () => {
        saveColorSpy = spyOn(service, 'saveColor');
        service.currentColor = 'Secondary';
        service.secondaryColor = 'rgba(0,0,0,1)';
        service.confirmColorSelection('rgba(43,43,125,1)');
        expect(saveColorSpy).toHaveBeenCalledWith('rgba(0,0,0,1)');
    });

    it('confirmColorSelection should update Primary color with given color if it was changed', () => {
        service.currentColor = 'Primary';
        service.primaryColor = 'rgba(0,0,0,1)';
        service.confirmColorSelection('rgba(28,79,203,1)');
        expect(service.primaryColor).toEqual('rgba(28,79,203,1)');
    });

    it('confirmColorSelection should update Secondary color with given color if it was changed', () => {
        service.currentColor = 'Secondary';
        service.secondaryColor = 'rgba(0,0,0,1)';
        service.confirmColorSelection('rgba(28,79,203,1)');
        expect(service.secondaryColor).toEqual('rgba(28,79,203,1)');
    });

    it('confirmColorSelection should not call saveColor if the Primary color was not changed', () => {
        saveColorSpy = spyOn(service, 'saveColor');
        service.currentColor = 'Primary';
        service.primaryColor = 'rgba(0,0,0,1)';
        service.confirmColorSelection('rgba(0,0,0,1)');
        expect(saveColorSpy).not.toHaveBeenCalled();
    });

    it('confirmColorSelection should not call saveColor if the Primary color was not changed', () => {
        saveColorSpy = spyOn(service, 'saveColor');
        service.currentColor = 'Secondary';
        service.secondaryColor = 'rgba(0,0,0,1)';
        service.confirmColorSelection('rgba(0,0,0,1)');
        expect(saveColorSpy).not.toHaveBeenCalled();
    });

    it('confirmColorSelection should do nothing if there was an error in the selection', () => {
        saveColorSpy = spyOn(service, 'saveColor');
        service.currentColor = 'Sec';
        service.secondaryColor = 'rgba(0,0,0,1)';
        service.confirmColorSelection('rgba(200,33,56,1)');
        expect(saveColorSpy).not.toHaveBeenCalled();
        expect(service.secondaryColor).not.toEqual('rgba(200,33,56,1)');
        service.currentColor = '.!';
        service.primaryColor = 'rgba(0,0,0,1)';
        service.confirmColorSelection('rgba(200,33,56,1)');
        expect(saveColorSpy).not.toHaveBeenCalled();
        expect(service.primaryColor).not.toEqual('rgba(200,33,56,1)');
    });

    it('readRGBValues should return an array containig the correct rgb values of the color string given', () => {
        const expectedResult: string[] = ['23', '200', '56', '1'];
        expect(service.readRGBValues('rgba(23,200,56,1)')).toEqual(expectedResult);
    });

    it('readRGBValues should return an array string for color black if provided color is invalid', () => {
        const expectedResult: string[] = ['00', '00', '00', '1'];
        expect(service.readRGBValues('')).toEqual(expectedResult);
    });

    it('verifyOpacityInput should return the a value of the opacity input value if it is not empty and lower than 100', () => {
        expect(service.verifyOpacityInput('76')).toEqual('0.76');
        expect(service.verifyOpacityInput('100')).toEqual('1');
        expect(service.verifyOpacityInput('0')).toEqual('0');
    });

    it('verifyOpacityInput should return 1 if the provided opacity is greater than 100 or empty', () => {
        expect(service.verifyOpacityInput('345')).toEqual('1');
        expect(service.verifyOpacityInput('999')).toEqual('1');
        expect(service.verifyOpacityInput('101')).toEqual('1');
        expect(service.verifyOpacityInput('')).toEqual('1');
    });
});
