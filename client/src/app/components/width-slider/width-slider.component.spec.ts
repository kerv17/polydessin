import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { MatSliderChange } from '@angular/material/slider/slider';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { EllipsisService } from '@app/services/tools/ToolServices/ellipsis-service';
import { LineService } from '@app/services/tools/ToolServices/line-service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { RectangleService } from '@app/services/tools/ToolServices/rectangle-service';
import { WidthSliderComponent } from './width-slider.component';

describe('WidthSliderComponent', () => {
    let component: WidthSliderComponent;
    let fixture: ComponentFixture<WidthSliderComponent>;
    let matSliderChange: MatSliderChange;
    let toolController: ToolControllerService;
    let pencil: PencilService;

    const defaultToolValue = 5;

    beforeEach(async(() => {
        toolController = new ToolControllerService({} as PencilService, {} as RectangleService, {} as LineService, {} as EllipsisService);

        pencil = new PencilService({} as DrawingService);
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [WidthSliderComponent, MatSlider],
            providers: [
                WidthSliderComponent,
                { provide: ToolControllerService, useValue: toolController },
                { provide: PencilService, useValue: pencil },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        matSliderChange = {
            value: Globals.TEST_MAT_SLIDER_VALUE, // valeur uniquement utilisé pour les test
        } as MatSliderChange;

        pencil.width = defaultToolValue;

        toolController.currentTool = pencil;
        fixture = TestBed.createComponent(WidthSliderComponent);
        component = fixture.componentInstance;
        component.change = true;
        fixture.detectChanges();
    });
    it('should create PencilService', () => {
        expect(pencil).toBeTruthy();
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
        const previousToolWidth: number = toolController.currentTool.width;
        matSliderChange.value = null;
        component.updateWidthValues(matSliderChange);
        expect(component.width).toEqual(previousWidth);
        expect(toolController.currentTool.width).toEqual(previousToolWidth);
    });

    it('Verifying that the component sets the right width value for the tool', () => {
        component.updateWidthValues(matSliderChange);
        expect(toolController.currentTool.width).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
    });

    it('verifying ngOnchanges with the change value changing', () => {
        component.updateWidthValues(matSliderChange);
        const newValue = 8;
        toolController.currentTool.width = newValue;
        // On doit faire comme si le form contenait une nouvelle valeur
        const temp = toolController.currentTool.width;

        component.ngOnChanges({ change: new SimpleChange(null, component.change, true) });
        expect(toolController.currentTool.width).toEqual(temp);
        expect(component.width).toEqual(newValue);
    });

    it('verifying ngOnchanges with the change value not changing', () => {
        // set the value of width to 12
        component.updateWidthValues(matSliderChange);
        component.ngOnChanges({});
        // On doit faire comme si le form contenait une nouvelle valeur

        // on change pas la valeur de set
        expect(component.width).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
        expect(toolController.currentTool.width).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
    });
});