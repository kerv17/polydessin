import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider/slider';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { WidthSliderComponent } from './width-slider.component';

fdescribe('WidthSliderComponent', () => {
    let component: WidthSliderComponent;
    let fixture: ComponentFixture<WidthSliderComponent>;
    let matSliderChange: MatSliderChange;
    let toolControllerSpy: jasmine.SpyObj<ToolControllerService>;
    let pencilStub: jasmine.SpyObj<PencilService>;
    const matSlidervalue = 12;

    beforeEach(async(() => {
        toolControllerSpy = jasmine.createSpyObj('ToolControllerService', ['setCrayon']);
        pencilStub = jasmine.createSpyObj('PencilService', [onclick]);
        TestBed.configureTestingModule({
            declarations: [WidthSliderComponent],
            providers: [
                WidthSliderComponent,
                { provide: ToolControllerService, useValue: toolControllerSpy },
                { provide: PencilService, useValue: pencilStub },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        matSliderChange = {
            value: matSlidervalue, // valeur uniquement utilisé pour les test
        } as MatSliderChange;
        pencilStub = TestBed.inject(PencilService) as jasmine.SpyObj<PencilService>;
        pencilStub.width = 5;
        toolControllerSpy = TestBed.inject(ToolControllerService) as jasmine.SpyObj<ToolControllerService>;
        toolControllerSpy.currentTool = pencilStub;
        fixture = TestBed.createComponent(WidthSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create PencilService', () => {
        expect(pencilStub).toBeTruthy();
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
        component.getSliderValue(matSliderChange);
        expect(component.width).toEqual(matSlidervalue);
    });

    it('Verifying that getSliderValue does nothing if the evt.value is null', () => {
        const previousWidth: number = component.width;
        const previousToolWidth: number = toolControllerSpy.currentTool.width;
        matSliderChange.value = null;
        component.getSliderValue(matSliderChange);
        expect(component.width).toEqual(previousWidth);
        expect(toolControllerSpy.currentTool.width).toEqual(previousToolWidth);
    });

    it('Verifying that the component sets the right width value for the tool', () => {
        component.getSliderValue(matSliderChange);
        expect(toolControllerSpy.currentTool.width).toEqual(matSlidervalue);
    });

    it('verifying ngOnchanges with the setvalue changing', () => {
        component.getSliderValue(matSliderChange);
        // On doit faire comme si le form contenait une nouvelle valeur
        const temp = toolControllerSpy.currentTool.width;
        component.ngOnChanges({ set: new SimpleChange(null, component.width, true) });
        expect(toolControllerSpy.currentTool.width).toEqual(temp);
    });

    it('verifying ngOnchanges with the setvalue not changing', () => {
        // set the value of width to 12
        component.getSliderValue(matSliderChange);
        component.ngOnChanges({});
        // On doit faire comme si le form contenait une nouvelle valeur

        // on change pas la valeur de set
        expect(component.width).toEqual(matSlidervalue);
    });
});
