import { TestBed } from '@angular/core/testing';
import { SIDEBAR_WIDTH } from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';
import { CanvasTestHelper } from './canvas-test-helper';

import { Setting, Tool } from './tool';
import { Vec2 } from './vec2';

fdescribe('Tool', () => {
  let service: Tool;
  let drawServiceSpy: jasmine.SpyObj<DrawingService>;
  let testSetting:Setting

  //let baseCtxStub: CanvasRenderingContext2D;
  let previewCtxStub: CanvasRenderingContext2D;

  let canvasTestHelper: CanvasTestHelper;

  beforeEach(() => {
    drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
    TestBed.configureTestingModule({
      providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
    });
    testSetting = {
      mouseDownCoord : {x:25,y:30},
      mouseDown : true,
      outOfBounds : true,
      color:'red',
      color2:'blue',
      width: 5,
      pointWidth: 7,
      toolMode: "alphabet",
      shift: true,
      pathData: [{} as Vec2,{} as Vec2,{} as Vec2]
    };
    canvasTestHelper = TestBed.inject(CanvasTestHelper);
    //baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

    service = TestBed.inject(PencilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getPositionFromMouse returns position relative to page', () => {
      const mouseEvent:MouseEvent = new MouseEvent('click',{clientX:15,clientY:15})
      const pos = service.getPositionFromMouse(mouseEvent);
      expect(pos).toEqual({x:15-SIDEBAR_WIDTH,y:15});
  });

  it('clearPath empties the path', () => {
    (service as any).pathData = [{} as Vec2, {} as Vec2,{} as Vec2]
    service.clearPath();
    expect((service as any).pathData.length).toEqual(0);
  });

  it('clearPreviewCtx should clear previewCtx', () => {
      service.clearPreviewCtx();
      expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
      service.drawingService.previewCtx = previewCtxStub;
      service.clearPreviewCtx();
      expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
  });

  it('saveSetting should return setting', () =>{
      const setting = (service as any).saveSetting();
      expect(setting).toBeTruthy();
  });

  it('loadSetting should load Setting', () =>{
    (service as any).loadSetting(testSetting);

    const setting = (service as any).saveSetting();
    expect(setting).toEqual(testSetting);
  });


  it('saveSetting should return setting', () =>{
    const settingSpy = spyOn<any>(service,'saveSetting').and.callThrough();
    const action:DrawAction = (service as any).createAction();
    expect(settingSpy).toHaveBeenCalled();
    expect(action.type).toEqual('Draw');
    expect(action.tool).toEqual(service as Tool);
    expect(action.setting).toEqual((service as any).saveSetting());
    expect(action.canvas).toEqual(service.drawingService.baseCtx);
  });

  it('should dispatch event', () => {
      let called = false;
      const action:DrawAction = (service as any).createAction();
      let recievedAction:DrawAction = {} as DrawAction;
      addEventListener('action',(event:CustomEvent)=>{
        recievedAction = event.detail;
        called = true;
      });
      (service as any).dispatchAction(action);
      expect(called).toBeTrue();
      expect(recievedAction).toEqual(action);
  });
});
