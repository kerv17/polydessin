import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider/slider';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { WidthSliderComponent } from './width-slider.component';

fdescribe('WidthSliderComponent', () => {
    let component: WidthSliderComponent;
    let fixture: ComponentFixture<WidthSliderComponent>;
    let matSliderChange: MatSliderChange;
    let toolControllerSpy: jasmine.SpyObj<ToolControllerService>;
    let pencil: PencilService;
    const matSlidervalue = 12;
    const defaultToolValue = 5;

    beforeEach(async(() => {
        toolControllerSpy = jasmine.createSpyObj('ToolControllerService', ['setTool']);
        pencil = new PencilService({} as DrawingService);
        TestBed.configureTestingModule({
            declarations: [WidthSliderComponent],
            providers: [
                WidthSliderComponent,
                { provide: ToolControllerService, useValue: toolControllerSpy },
                { provide: PencilService, useValue: pencil },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        matSliderChange = {
            value: matSlidervalue, // valeur uniquement utilisé pour les test
        } as MatSliderChange;

        pencil.width = defaultToolValue;

        toolControllerSpy.currentTool = pencil;
        fixture = TestBed.createComponent(WidthSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create PencilService', () => {
        expect(pencil).toBeTruthy();
    });

    it('should create PencilService and attribute it to toolController', () => {
        expect(toolControllerSpy.currentTool).toBeTruthy();
    });

    it('should create ToolController', () => {
        expect(toolControllerSpy).toBeTruthy();
    });

    it('should create the widthSlider component', () => {
        expect(component).toBeTruthy();
    });

    it('Verifying that the component sets the right width value', () => {
        component.updateWidthValues(matSliderChange);

        expect(component.width).toEqual(matSlidervalue);
    });

    it('Verifying that getSliderValue does nothing if the evt.value is null', () => {
        const previousWidth: number = component.width;
        const previousToolWidth: number = toolControllerSpy.currentTool.width;
        matSliderChange.value = null;
        component.updateWidthValues(matSliderChange);
        expect(component.width).toEqual(previousWidth);
        expect(toolControllerSpy.currentTool.width).toEqual(previousToolWidth);
    });

    it('Verifying that the component sets the right width value for the tool', () => {
        component.updateWidthValues(matSliderChange);
        expect(toolControllerSpy.currentTool.width).toEqual(matSlidervalue);
    });

    it('verifying ngOnchanges with the setvalue changing', () => {
        component.updateWidthValues(matSliderChange);
        const newValue = 8;
        toolControllerSpy.currentTool.width = newValue;
        // On doit faire comme si le form contenait une nouvelle valeur
        const temp = toolControllerSpy.currentTool.width;
        component.ngOnChanges({ change: new SimpleChange(null, component.width, true) });
        expect(toolControllerSpy.currentTool.width).toEqual(temp);
        expect(component.width).toEqual(newValue);
    });

    it('verifying ngOnchanges with the setvalue not changing', () => {
        // set the value of width to 12
        component.updateWidthValues(matSliderChange);
        component.ngOnChanges({});
        // On doit faire comme si le form contenait une nouvelle valeur

        // on change pas la valeur de set
        expect(component.width).toEqual(matSlidervalue);
        expect(toolControllerSpy.currentTool.width).toEqual(matSlidervalue);
    });
});
