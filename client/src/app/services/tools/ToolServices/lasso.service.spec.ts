import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LassoService } from './lasso.service';

fdescribe('LassoService', () => {
    let service: LassoService;
    let mouseEvent: MouseEvent;
    let passSpy: jasmine.Spy;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let ctxSpy: jasmine.SpyObj<CanvasRenderingContext2D>;
    let testPath:Vec2[];
    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService',['clearCanvas']);
        ctxSpy = jasmine.createSpyObj('CanvasRenderingContext2D',['stroke','beginPath','lineTo']);
        drawServiceSpy.baseCtx = ctxSpy;
        drawServiceSpy.previewCtx = ctxSpy;
        TestBed.configureTestingModule({providers:[
            { provide: DrawingService, useValue: drawServiceSpy }
        ]});
        service = TestBed.inject(LassoService);
        mouseEvent =  {pageX: Globals.SIDEBAR_WIDTH + 50,
        pageY: 50, button:Globals.MouseButton.Left} as MouseEvent;
        passSpy = spyOn(service,'passToSelectionService');
        testPath = [ {x:0,y:0}, {x:0,y:100}, {x:-50,y:50} ];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onClick', ()=> {
        service.toolMode = 'selection';
        const spy = spyOn(service,'addPoint');
        service.onClick(mouseEvent);
        expect(spy).toHaveBeenCalled();

        service.toolMode = 'movement';
        const selectAreaSpy = spyOn(service, 'selectArea');
        service.onClick(mouseEvent);
        
        expect(passSpy).toHaveBeenCalled();
        expect(selectAreaSpy).toHaveBeenCalled();
        expect((service as any).pathData).toEqual([]);
    });

    it('onMouseMove', ()=>{
        service.toolMode = 'selection';
        (service as any).pathData = testPath;
        service.onMouseMove(mouseEvent);
        expect(ctxSpy.strokeStyle).toEqual('red');
        expect(ctxSpy.stroke).toHaveBeenCalled();

    });

    it('addPoint', ()=>{
        (service as any).pathData = testPath;
        service.addPoint({x:50,y:50})
        expect((service as any).pathData).toEqual(testPath);

        console.log((service as any).pathData);
        service.addPoint({x:0,y:0});
        testPath.push({x:0,y:0});
        expect((service as any).pathData).toEqual(testPath);

        testPath = [{x:0,y:0}, {x:0,y:50}];
        (service as any).pathData = testPath;
        service.addPoint({x:25,y:35});
        testPath.push({x:25,y:35});
        expect((service as any).pathData).toEqual(testPath);

    });

    it('checkIsPointValid', ()=>{
        (service as any).pathData = testPath;
        expect(service.checkIsPointValid({x:50,y:50})).toBeFalse();
        expect(service.checkIsPointValid({x:-50,y:-50})).toBeTrue();
        (service as any).pathData = [];
        expect(service.checkIsPointValid({x:-50,y:-50})).toBeTrue();
    })
});
