import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from './drawing.service';

fdescribe('DrawingService', () => {
    let service: DrawingService;
    let canvasTestHelper: CanvasTestHelper;
    let fillRectSpy: jasmine.Spy;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.canvas = canvasTestHelper.canvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should set canvasSize to 250 by 250 if drawing vue is inferior to 970 by 500 (500+470)',() =>{
        global.innerWidth =700;
        global.innerHeight =500;
        const expectedResult = 250;
        const expectedVect ={x:expectedResult,y:expectedResult};
        expect(service.setSizeCanva()).toEqual(expectedVect);
    });
    it('should set canvasSize to (width-sidebar)/2 by height/2 if drawing vue width is greater then 970 and height is greater then 500',() =>{
        global.innerWidth =1470;
        global.innerHeight =800;
        const expectedResultX = 500;
        const expectedResultY = 400;
        const expectedVect ={x:expectedResultX,y:expectedResultY};
        expect(service.setSizeCanva()).toEqual(expectedVect);
    });
    it('should set canvasSize to 250 by height/2 if drawing vue width is lesser then 970 and height is greater then 500',() =>{
        global.innerWidth =800;
        global.innerHeight =600;
        const expectedResultX = 250;
        const expectedResultY = 300;
        const expectedVect ={x:expectedResultX,y:expectedResultY};
        expect(service.setSizeCanva()).toEqual(expectedVect);

    });
    it('should set canvasSize to (width-sidebar)/2 by 250 if  drawing vue width is greater then 970 and height is lesser then 500',() =>{
        global.innerWidth =1000;
        global.innerHeight =400;
        const expectedResultX = 265;
        const expectedResultY = 250;
        const expectedVect ={x:expectedResultX,y:expectedResultY};
        expect(service.setSizeCanva()).toEqual(expectedVect);

    });
    it('should set controlSize to same value as canvasSize',() =>{
        global.innerWidth =1470;
        const expectedResultX = 500;
        global.innerHeight =800;
        const expectedResultY = 400;
        service.setSizeCanva();
        expect(service.controlSize.x).toEqual(expectedResultX);
        expect(service.controlSize.y).toEqual(expectedResultY);

    });
    it('should clear the whole canvas', () => {
        service.clearCanvas(service.baseCtx);
        const pixelBuffer = new Uint32Array(service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height).data.buffer);
        const hasColoredPixels = pixelBuffer.some((color) => color !== 0);
        expect(hasColoredPixels).toEqual(false);
    });
    it('should fill new width',()=>{
        const previousSize ={x:300,y:400};
        const newSize ={x:500,y:400};
        fillRectSpy= spyOn(service.baseCtx,'fillRect');
        service.fillNewSpace(previousSize,newSize);
        expect(fillRectSpy).toHaveBeenCalledWith(previousSize.x, 0, newSize.x, previousSize.y);
    });
    it('should fill new height',()=>{
        const previousSize ={x:300,y:400};
        const newSize ={x:300,y:600};
        fillRectSpy= spyOn(service.baseCtx,'fillRect');
        service.fillNewSpace(previousSize,newSize);
        expect(fillRectSpy).toHaveBeenCalledWith(0,previousSize.y, newSize.x, newSize.y);
    });
    it('should not fill',()=>{
        const previousSize ={x:500,y:400};
        const newSize ={x:300,y:300};
        fillRectSpy= spyOn(service.baseCtx,'fillRect');
        service.fillNewSpace(previousSize,newSize);
        expect(fillRectSpy).not.toHaveBeenCalled();
    });
    it('should fill new height and width',()=>{
        const previousSize ={x:500,y:400};
        const newSize ={x:700,y:700};
        fillRectSpy= spyOn(service.baseCtx,'fillRect');
        service.fillNewSpace(previousSize,newSize);
        expect(fillRectSpy).toHaveBeenCalledWith(previousSize.x, 0, newSize.x, previousSize.y);
        expect(fillRectSpy).toHaveBeenCalledWith(0,previousSize.y, newSize.x, newSize.y);
    });
});
