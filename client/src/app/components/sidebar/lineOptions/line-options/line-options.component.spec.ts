import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { LineService } from '@app/services/tools/ToolServices/line.service';
import { LineOptionsComponent } from './line-options.component';
describe('LineOptionsComponent', () => {
    let component: LineOptionsComponent;
    let fixture: ComponentFixture<LineOptionsComponent>;
    let lineTool: LineService;
    let toolControllerSpy: jasmine.SpyObj<ToolControllerService>;

    beforeEach(async(() => {
        toolControllerSpy = jasmine.createSpyObj(ToolControllerService, ['getLineMode']);
        TestBed.configureTestingModule({
            declarations: [LineOptionsComponent],
            providers: [LineOptionsComponent, { provide: ToolControllerService, useValue: toolControllerSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        lineTool = new LineService({} as DrawingService);
        toolControllerSpy.currentTool = lineTool;
        fixture = TestBed.createComponent(LineOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be able to change the mode to point if the input change is true', () => {
        component.setPoint(true);
        expect(component.linePoint).toBeTrue();
        expect(toolControllerSpy.currentTool.toolMode).toEqual('point');
    });

    it('should be able to change the mode to point if the input change is true', () => {
        component.setPoint(false);
        expect(component.linePoint).not.toBeTrue();
        expect(toolControllerSpy.currentTool.toolMode).toEqual('noPoint');
    });
});
