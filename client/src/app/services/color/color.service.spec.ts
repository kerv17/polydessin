import { TestBed } from '@angular/core/testing';
import { ColorService } from './color.service';

describe('ColorService', () => {
    let service: ColorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ColorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' isHexadecimal should return true if color is hexadecimal with 2 chararcters', () => {
        const expectedResult = true;
        const color = 'a5';
        expect(service.isHexadecimal(color)).toEqual(expectedResult);
    });

    it(' isHexadecimal should return true if color is hexadecimal with 1 character', () => {
        const expectedResult = true;
        const color = '6';
        expect(service.isHexadecimal(color)).toEqual(expectedResult);
    });

    it(' isHexadecimal should return false if color is not hexadecimal with 3 characters', () => {
        const expectedResult = false;
        const color = '12h';
        expect(service.isHexadecimal(color)).toEqual(expectedResult);
    });

    it(' isHexadecimal should return false if color is not hexadecimal with 2 characters', () => {
        const expectedResult = false;
        const color = 'gg';
        expect(service.isHexadecimal(color)).toEqual(expectedResult);
    });

    it(' isHexadecimal should return false if color is not hexadecimal with 1 characters', () => {
        const expectedResult = false;
        const color = 'x';
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
});
