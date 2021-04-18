import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSlider, MatSliderChange } from '@angular/material/slider';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { AerosolService } from '@app/services/tools/ToolServices/aerosol-service.service';
import { BucketService } from '@app/services/tools/ToolServices/bucket.service';
import * as Globals from '@app/Constants/constants';
import { EllipsisService } from '@app/services/tools/ToolServices/ellipsis-service';
import { LineService } from '@app/services/tools/ToolServices/line-service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { RectangleService } from '@app/services/tools/ToolServices/rectangle-service';
import { SelectionService } from '@app/services/tools/ToolServices/selection.service';
import { StampService } from '@app/services/tools/ToolServices/stamp.service';

import { StampSliderComponent } from './stamp-slider.component';
import { SimpleChange } from '@angular/core';

describe('StampSliderComponent', () => {
    let component: StampSliderComponent;
    let fixture: ComponentFixture<StampSliderComponent>;
    let toolController: ToolControllerService;
    let tool: StampService;
    let matSliderChange: MatSliderChange;
    const defaultToolValue = 5;
    beforeEach(async(() => {
        toolController = new ToolControllerService(
            {} as PencilService,
            {} as RectangleService,
            {} as LineService,
            {} as EllipsisService,
            {} as AerosolService,
            {} as SelectionService,
            {} as StampService,
            {} as BucketService,
        );

        tool = new StampService({} as DrawingService);
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [StampSliderComponent, MatSlider],
            providers: [
                StampSliderComponent,
                { provide: ToolControllerService, useValue: toolController },
                { provide: StampService, useValue: tool },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        matSliderChange = {
            value: Globals.TEST_MAT_SLIDER_VALUE, // valeur uniquement utilisé pour les test
        } as MatSliderChange;

        tool.width = defaultToolValue;

        toolController.currentTool = tool;
        fixture = TestBed.createComponent(StampSliderComponent);
        component = fixture.componentInstance;
        component.change = true;
        fixture.detectChanges();
    });
    it('should create toolService', () => {
        expect(tool).toBeTruthy();
    });

    it('should create PencilService and attribute it to toolController', () => {
        expect(toolController.currentTool).toBeTruthy();
    });

    it('should create ToolController', () => {
        expect(toolController).toBeTruthy();
    });

    it('should create the widthSlider component', () => {
        expect(component).toBeTruthy();
    });

    it('Verifying that the component sets the right width value', () => {
        component.updateWidthValues(matSliderChange);

        expect(component.width).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
    });

    it('Verifying that updateWidthValues does nothing if the evt.value is null', () => {
        const previousWidth: number = component.width;
        const previousToolWidth: number = (toolController.getTool(Globals.STAMP_SHORTCUT) as any).sprayRadius;
        matSliderChange.value = null;
        component.updateWidthValues(matSliderChange);
        expect(component.width).toEqual(previousWidth);
        expect((toolController.getTool(Globals.STAMP_SHORTCUT) as any).sprayRadius).toEqual(previousToolWidth);
    });

    it('Verifying that the component sets the right width value for the tool', () => {
        component.updateWidthValues(matSliderChange);
        expect((toolController.getTool(Globals.STAMP_SHORTCUT) as any).sprayRadius).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
    });

    it('verifying ngOnchanges with the change value changing', () => {
        component.updateWidthValues(matSliderChange);
        const newValue = 8;
        (toolController.getTool(Globals.STAMP_SHORTCUT) as any).sprayRadius = newValue;
        // On doit faire comme si le form contenait une nouvelle valeur
        const temp = (toolController.getTool(Globals.STAMP_SHORTCUT) as any).sprayRadius;

        component.ngOnChanges({ change: new SimpleChange(null, component.change, true) });
        expect((toolController.getTool(Globals.STAMP_SHORTCUT) as any).sprayRadius).toEqual(temp);
        expect(component.width).toEqual(newValue);
    });

    it('verifying ngOnchanges with the change value not changing', () => {
        // set the value of width to 12
        component.updateWidthValues(matSliderChange);
        component.ngOnChanges({});
        // On doit faire comme si le form contenait une nouvelle valeur

        // on change pas la valeur de set
        expect(component.width).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
        expect((toolController.getTool(Globals.STAMP_SHORTCUT) as any).sprayRadius).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
    });
});
