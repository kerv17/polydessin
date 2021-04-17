import { TestBed } from '@angular/core/testing';
import { Setting } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';
import { angleTurnPerRotation, StampService } from './stamp.service';

// tslint:disable: no-any
// tslint:disable: no-magic-numbers
describe('StampService', () => {
    let service: StampService;
    let mouseEvent: MouseEvent;
    let mouseEvent2: MouseEvent;
    let drawingService: DrawingService;
    let baseCtxSpy: jasmine.SpyObj<CanvasRenderingContext2D>;
    let drawStampSpy: jasmine.Spy<any>;
    let wheelEvent: WheelEvent;

    beforeEach(() => {
        drawingService = new DrawingService({} as ResizePoint);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingService }],
        });
        baseCtxSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['translate', 'rotate', 'scale', 'drawImage', 'setTransform']);
        drawingService.baseCtx = baseCtxSpy;
        service = TestBed.inject(StampService);
        drawStampSpy = spyOn(service as any, 'drawStamp');

        mouseEvent = {
            pageX: 500,
            pageY: 200,
            button: 0,
        } as MouseEvent;

        mouseEvent2 = {
            pageX: 500,
            pageY: 200,
            button: 1,
        } as MouseEvent;

        wheelEvent = {
            deltaY: 5,
            altKey: false,
        } as WheelEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('click should draw the stamp', () => {
        let actionCalled = false;
        addEventListener('action', () => {
            actionCalled = true;
        });
        service.onClick(mouseEvent);
        expect((service as any).pathData).toEqual([service.getPositionFromMouse(mouseEvent)]);
        expect(drawStampSpy).toHaveBeenCalled();
        expect(actionCalled).toBeTrue();
    });

    it('click should not draw the stamp if wrong mouse button', () => {
        let actionCalled = false;
        addEventListener('action', () => {
            actionCalled = true;
        });
        service.onClick(mouseEvent2);
        expect((service as any).pathData).not.toEqual([service.getPositionFromMouse(mouseEvent)]);
        expect(drawStampSpy).not.toHaveBeenCalled();
        expect(actionCalled).toBeFalse();
    });

    it('onWheel should change the orientation', () => {
        service.onWheel(wheelEvent);
        expect(service.pointWidth).toEqual(angleTurnPerRotation);
        expect(drawStampSpy).toHaveBeenCalled();

        wheelEvent = wheelEvent = {
            deltaY: -25,
            altKey: true,
        } as WheelEvent;

        service.onWheel(wheelEvent);
        expect(service.pointWidth).toEqual(angleTurnPerRotation - 1);
        expect(drawStampSpy).toHaveBeenCalled();
    });

    it('onMouseMove', () => {
        service.onMouseMove(mouseEvent);
        expect((service as any).pathData).toEqual([service.getPositionFromMouse(mouseEvent)]);
        expect(drawStampSpy).toHaveBeenCalled();
    });

    it('setScaleRotation', () => {
        const orientation = 90;
        (service as any).pathData = [{ x: 250, y: 250 }];
        service.width = 15;
        service.setStampRotationScale(baseCtxSpy, orientation);
        expect(baseCtxSpy.translate).toHaveBeenCalledWith(250, 250);
        expect(baseCtxSpy.scale).toHaveBeenCalledWith(15 / service.scaleRatio, 15 / service.scaleRatio);
        expect(baseCtxSpy.rotate).toHaveBeenCalledWith((service as any).convertDegToRad(orientation));
        expect(baseCtxSpy.translate).toHaveBeenCalledWith(-250, -250);
    });

    it('drawStamp', () => {
        drawStampSpy.and.callThrough();
        const rotationScaleSpy = spyOn(service, 'setStampRotationScale');
        (service as any).pathData = [{ x: 250, y: 250 }];
        (service as any).drawStamp(baseCtxSpy);
        expect(rotationScaleSpy).toHaveBeenCalledWith(baseCtxSpy, service.pointWidth);
        expect(baseCtxSpy.drawImage).toHaveBeenCalled();
        expect(baseCtxSpy.setTransform).toHaveBeenCalled();
    });

    it('doAction', () => {
        const action: DrawAction = {
            type: 'Draw',
            tool: service,
            setting: {
                pathData: [{ x: 100, y: 100 }],
                pointWidth: 15,
                width: 30,
            } as Setting,
            canvas: baseCtxSpy,
        };
        const setting = (service as any).saveSetting();
        service.doAction(action);
        expect(drawStampSpy).toHaveBeenCalledWith(baseCtxSpy);
        expect((service as any).saveSetting()).toEqual(setting);
    });

    it('convertDegToGrad', () => {
        expect((service as any).convertDegToRad(15)).toEqual(Math.PI / 12);
    });

    it('scaleImage', () => {
        const image: HTMLImageElement = { naturalWidth: 960, naturalHeight: 678 } as HTMLImageElement;
        console.log(image.naturalWidth, image.naturalHeight);
        expect((service as any).scaleImage(image)).toEqual({ x: 176.5625, y: 250 });
    });

    it('onClick should dispatch saveState Event', () => {
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);
        service.onClick(mouseEvent);
        expect(spyDispatch).toHaveBeenCalled();
    });
});
