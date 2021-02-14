import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { EllipsisService } from '@app/services/tools/ToolServices/ellipsis-service';
import { LineService } from '@app/services/tools/ToolServices/line-service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { RectangleService } from '@app/services/tools/ToolServices/rectangle-service';
import { PointWidthSliderComponent } from './point-width-slider.component';
fdescribe('PointWidthSliderComponent', () => {
    let component: PointWidthSliderComponent;
    let fixture: ComponentFixture<PointWidthSliderComponent>;
    let toolController: ToolControllerService;
    let line: LineService;
    let matSliderChange: MatSliderChange;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PointWidthSliderComponent],
            providers: [
                PointWidthSliderComponent,
                { provide: ToolControllerService, useValue: toolController },
                { provide: LineService, useValue: line },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        line = new LineService({} as DrawingService);
        const DEFAULT_WIDTH_VALUE = 5;
        line.pointWidth = DEFAULT_WIDTH_VALUE;
        toolController = new ToolControllerService({} as PencilService, {} as RectangleService, line, {} as EllipsisService);
        toolController.currentTool = line;
        fixture = TestBed.createComponent(PointWidthSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        matSliderChange = {
            value: Globals.TEST_MAT_SLIDER_VALUE, // valeur uniquement utilisé pour les test
        } as MatSliderChange;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('Verifying that the component sets the right width value', () => {
        component.getPointSliderValue(matSliderChange);

        expect(component.pointWidth).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
    });

    it('Verifying that updateWidthValues does nothing if the evt.value is null', () => {
        const previousWidth: number = component.pointWidth;
        const previousToolWidth: number = toolController.currentTool.pointWidth;
        matSliderChange.value = null;
        component.getPointSliderValue(matSliderChange);
        expect(component.pointWidth).toEqual(previousWidth);
        expect(toolController.currentTool.pointWidth).toEqual(previousToolWidth);
    });

    it('Verifying that the component sets the right width value for the tool', () => {
        component.getPointSliderValue(matSliderChange);
        expect(toolController.currentTool.pointWidth).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
    });

    it('verifying ngOnchanges with the change value changing', () => {
        component.getPointSliderValue(matSliderChange);
        const newValue = 8;
        toolController.currentTool.pointWidth = newValue;
        // On doit faire comme si le form contenait une nouvelle valeur
        const temp = toolController.currentTool.pointWidth;

        component.ngOnChanges({ change: new SimpleChange(null, component.change, true) });
        expect(toolController.currentTool.pointWidth).toEqual(temp);
        expect(component.pointWidth).toEqual(newValue);
    });

    it('verifying ngOnchanges with the change value not changing', () => {
        // set the value of pointwidth to 12
        component.getPointSliderValue(matSliderChange);
        // component.ngOnChanges({});
        // On doit faire comme si le form contenait une nouvelle valeur

        // on change pas la valeur de set
        expect(component.pointWidth).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
        expect(toolController.currentTool.pointWidth).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
    });
});
