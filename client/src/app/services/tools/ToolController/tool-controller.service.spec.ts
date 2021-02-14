import { TestBed } from '@angular/core/testing';
import * as Globals from '@app/Constants/constants';
import { EllipsisService } from '@app/services/tools/ToolServices/ellipsis-service';
import { LineService } from '@app/services/tools/ToolServices/line-service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { RectangleService } from '@app/services/tools/ToolServices/rectangle-service';
import { ToolControllerService } from './tool-controller.service';
// tslint:disable:no-any
describe('ToolControllerService', () => {
    let service: ToolControllerService;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;
    let ellipsisServiceSpy: jasmine.SpyObj<EllipsisService>;
    let rectangleServiceSpy: jasmine.SpyObj<RectangleService>;
    let lineServiceSpy: jasmine.SpyObj<LineService>;

    // let serviceSpy:jasmine.Spy;

    beforeEach(() => {
        pencilServiceSpy = jasmine.createSpyObj('PencilService', {}, { color: 'test' });
        ellipsisServiceSpy = jasmine.createSpyObj('EllipsisService', {}, { color: 'test' });
        rectangleServiceSpy = jasmine.createSpyObj('RectangleService', {}, { color: 'test' });
        lineServiceSpy = jasmine.createSpyObj('LineService', {}, { color: 'test' });
        // serviceSpy = jasmine.createSpy('Toolservice',);
        TestBed.configureTestingModule({
            providers: [
                { provide: PencilService, useValue: pencilServiceSpy },
                { provide: EllipsisService, useValue: ellipsisServiceSpy },
                { provide: RectangleService, useValue: rectangleServiceSpy },
                { provide: LineService, useValue: lineServiceSpy },
            ],
        });
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolControllerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    xit('should call checkKeyPress() when any key is down', () => {
        const keyEventData = { isTrusted: true, key: Globals.CRAYON_SHORTCUT };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        dispatchEvent(keyDownEvent);
        // expect().toHaveBeenCalled();
    });

    it('it should set the right tool', () => {
        expect(service.currentTool).toEqual(pencilServiceSpy);
    });

    it('resetWidth should set width value of all tools to 1', () => {
        const widthTestValue = 50;
        pencilServiceSpy.width = widthTestValue;
        ellipsisServiceSpy.width = widthTestValue;
        rectangleServiceSpy.width = widthTestValue;
        lineServiceSpy.width = widthTestValue;
        service.resetWidth();
        expect(pencilServiceSpy.width).toEqual(1);
        expect(ellipsisServiceSpy.width).toEqual(1);
        expect(rectangleServiceSpy.width).toEqual(1);
        expect(lineServiceSpy.width).toEqual(1);
    });
});
