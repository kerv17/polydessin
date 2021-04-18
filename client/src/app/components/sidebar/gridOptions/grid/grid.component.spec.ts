/* tslint:disable:no-unused-variable */
/* tslint:disable:no-any*/
import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import { MatSliderChange } from '@angular/material/slider/slider';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/grid/grid.service';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
import { GridComponent } from './grid.component';

export class GridServiceStub {
    context: CanvasRenderingContext2D;
    boxSize: number = Globals.GRID_BOX_INIT_VALUE;
    opacity: number = Globals.GRID_OPACITY_INIT_VALUE;
    showGrid: boolean = false;
    shortcutIncrementGrid(): void {
        this.boxSize = this.boxSize + Globals.GRID_VARIATION_VALUE;
    }
    shortcutDecrementGrid(): void {
        this.boxSize = this.boxSize - Globals.GRID_VARIATION_VALUE;
    }
}

describe('GridComponent', () => {
    let component: GridComponent;
    let fixture: ComponentFixture<GridComponent>;
    let serviceStub: GridServiceStub;
    let drawingStub: DrawingService;
    let matSliderChange: MatSliderChange;
    let gridCtxSpy: jasmine.SpyObj<CanvasRenderingContext2D>;
    beforeEach(async(() => {
        drawingStub = new DrawingService({} as ResizePoint);
        gridCtxSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['lineTo', 'beginPath', 'stroke', 'moveTo']);
        drawingStub.gridCtx = gridCtxSpy;
        serviceStub = new GridServiceStub();

        TestBed.configureTestingModule({
            imports: [FormsModule, MatSliderModule],
            declarations: [GridComponent, MatSlider],
            providers: [GridComponent, { provide: GridService, useValue: serviceStub as GridServiceStub }],
        }).compileComponents();
    }));

    beforeEach(() => {
        matSliderChange = {
            value: Globals.TEST_MAT_SLIDER_VALUE, // valeur uniquement utilisé pour les test
        } as MatSliderChange;
        fixture = TestBed.createComponent(GridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create grid component', () => {
        expect(component).toBeTruthy();
    });

    it('Verifying that the component sets the right size value and dispatches event', () => {
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);

        component.updateSizeValues(matSliderChange);

        expect(component.size).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
        expect(spyDispatch).toHaveBeenCalled();
    });

    it('Verifying that updateSizeValues does nothing if the evt.value is null', () => {
        const previousSize: number = component.size;
        const previousGridSize: number = component.gridService.boxSize;
        matSliderChange.value = null;
        component.updateSizeValues(matSliderChange);
        expect(component.size).toEqual(previousSize);
        expect(component.gridService.boxSize).toEqual(previousGridSize);
    });
    it('Verifying that the component sets the right opacity value and dispatches event', () => {
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);

        component.updateOpacityValues(matSliderChange);

        expect(component.opacity).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
        expect(spyDispatch).toHaveBeenCalled();
    });

    it('Verifying that updateOpacityValues does nothing if the evt.value is null', () => {
        const previousOpacity: number = component.opacity;
        const previousGridOpacity: number = component.gridService.opacity;
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);
        matSliderChange.value = null;
        component.updateOpacityValues(matSliderChange);
        expect(component.opacity).toEqual(previousOpacity);
        expect(component.gridService.opacity).toEqual(previousGridOpacity);
        expect(spyDispatch).not.toHaveBeenCalled();
    });

    it('incrementSize should call shortcutIncrementGrid and dispatches event', () => {
        const spy = spyOn(serviceStub, 'shortcutIncrementGrid').and.returnValue();

        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);
        component.incrementSize();

        expect(spy).toHaveBeenCalled();
        expect(spyDispatch).toHaveBeenCalled();
    });
    it('decrementSize should call shortcutDecrementGrid and dispatches event', () => {
        const spy = spyOn(serviceStub, 'shortcutDecrementGrid').and.returnValue();
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);

        component.decrementSize();

        expect(spy).toHaveBeenCalled();
        expect(spyDispatch).toHaveBeenCalled();
    });

    it('verifying ngOnchanges with the change value changing opacity', () => {
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);

        component.updateOpacityValues(matSliderChange);
        const newValue = 8;
        component.gridService.opacity = newValue;
        // On doit faire comme si le form contenait une nouvelle valeur
        const temp = component.gridService.opacity;

        component.ngOnChanges({ change: new SimpleChange(null, component.change, true) });
        expect(component.gridService.opacity).toEqual(temp);
        expect(component.opacity).toEqual(newValue);
        expect(spyDispatch).toHaveBeenCalled();
    });
    it('verifying ngOnchanges with the change value changing size', () => {
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);

        component.updateSizeValues(matSliderChange);
        const newValue = 8;
        component.gridService.boxSize = newValue;
        // On doit faire comme si le form contenait une nouvelle valeur
        const temp = component.gridService.boxSize;

        component.ngOnChanges({ change: new SimpleChange(null, component.change, true) });
        expect(component.gridService.boxSize).toEqual(temp);
        expect(component.size).toEqual(newValue);
        expect(spyDispatch).toHaveBeenCalled();
    });
    it('verifying ngOnchanges with the change value not changing', () => {
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);

        component.updateOpacityValues(matSliderChange);
        component.ngOnChanges({});
        // On doit faire comme si le form contenait une nouvelle valeur

        // on change pas la valeur de set
        expect(component.opacity).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
        expect(serviceStub.opacity).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
        expect(spyDispatch).toHaveBeenCalled();
    });
    it('verifying ngOnchanges with the change value not changing', () => {
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);

        component.updateSizeValues(matSliderChange);
        component.ngOnChanges({});
        // On doit faire comme si le form contenait une nouvelle valeur

        // on change pas la valeur de set
        expect(component.size).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
        expect(serviceStub.boxSize).toEqual(Globals.TEST_MAT_SLIDER_VALUE);
        expect(spyDispatch).toHaveBeenCalled();
    });

    it('checking if onkeyPress calls appropriate function', () => {
        const keyEventData = { isTrusted: true, key: Globals.GRID_INCREMENT_PLUS_SHORTCUT, ctrlKey: false, shiftKey: false };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        component.gridService.showGrid = true;
        const functionSpy = spyOn((component as any).functionMap, 'get').and.returnValue(component.incrementSize);
        const eventSpy = spyOn(keyDownEvent, 'preventDefault');

        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);

        component.onKeyPress(keyDownEvent);
        expect(eventSpy).toHaveBeenCalled();
        expect(functionSpy).toHaveBeenCalled();
        expect(spyDispatch).toHaveBeenCalled();
    });

    it('should not call anything if the return value is null ', () => {
        component.initFunctionMap();
        component.gridService.showGrid = true;
        const keyEventData = { isTrusted: true, key: Globals.GRID_INCREMENT_PLUS_SHORTCUT, ctrlKey: false, shiftKey: false };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        const functionSpy = spyOn((component as any).functionMap, 'get').and.returnValue(null);
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);
        component.onKeyPress(keyDownEvent);
        expect(functionSpy).toHaveBeenCalled();
        expect(spyDispatch).not.toHaveBeenCalled();
    });
    it('should not call anything if the value isnt in the map is null ', () => {
        component.initFunctionMap();
        component.gridService.showGrid = true;
        const keyEventData = { isTrusted: true, key: 'p', ctrlKey: false, shiftKey: false };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        const functionSpy = spyOn((component as any).functionMap, 'get').and.returnValue(null);
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);
        component.onKeyPress(keyDownEvent);
        expect(functionSpy).not.toHaveBeenCalled();
        expect(spyDispatch).not.toHaveBeenCalled();
    });

    it('should not call anything if show grid is false', () => {
        component.initFunctionMap();
        component.gridService.showGrid = false;
        const keyEventData = { isTrusted: true, key: Globals.GRID_INCREMENT_PLUS_SHORTCUT, ctrlKey: false, shiftKey: false };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        const functionSpy = spyOn((component as any).functionMap, 'get').and.returnValue(null);
        const spyDispatch = spyOn(global, 'dispatchEvent').and.returnValue(true);
        component.onKeyPress(keyDownEvent);
        expect(functionSpy).not.toHaveBeenCalled();
        expect(spyDispatch).not.toHaveBeenCalled();
    });
});
