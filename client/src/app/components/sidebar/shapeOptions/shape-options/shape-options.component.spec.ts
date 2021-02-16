import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlider } from '@angular/material/slider';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { ShapeOptionsComponent } from './shape-options.component';
describe('ShapeOptionsComponent', () => {
    let component: ShapeOptionsComponent;
    let fixture: ComponentFixture<ShapeOptionsComponent>;
    let toolControllerSpy: jasmine.SpyObj<ToolControllerService>;
    let pencil: PencilService;
    let setButtonWhiteSpy: jasmine.Spy;
    let setFillSpy: jasmine.Spy;
    let setBorderSpy: jasmine.Spy;
    let fillBorderSpy: jasmine.Spy;
    beforeEach(async(() => {
        toolControllerSpy = jasmine.createSpyObj('ToolControllerService', ['setFill', 'setBorder', 'setFillBorder']);
        pencil = new PencilService({} as DrawingService);
        toolControllerSpy.currentTool = pencil;

        TestBed.configureTestingModule({
            declarations: [ShapeOptionsComponent, MatSlider],
            providers: [{ provide: ToolControllerService, useValue: toolControllerSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ShapeOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should create ToolControler', () => {
        expect(toolControllerSpy).toBeTruthy();
    });
    it('component.SetFill should call toolcontroller and change FillButton', () => {
        setButtonWhiteSpy = spyOn(component, 'setButtonsWhite');
        component.setFill();
        expect(setButtonWhiteSpy).toHaveBeenCalled();
        expect(toolControllerSpy.setFill).toHaveBeenCalled();
        expect(component.fillButton).toEqual(Globals.BACKGROUND_GAINSBORO);
    });

    it('component.SetBorder should call toolcontroller and change FillButton', () => {
        setButtonWhiteSpy = spyOn(component, 'setButtonsWhite');
        component.setBorder();
        expect(setButtonWhiteSpy).toHaveBeenCalled();
        expect(toolControllerSpy.setBorder).toHaveBeenCalled();
        expect(component.borderButton).toEqual(Globals.BACKGROUND_GAINSBORO);
    });
    it('component.SetFillBorder should call toolcontroller and change FillButton', () => {
        setButtonWhiteSpy = spyOn(component, 'setButtonsWhite');
        component.setFillBorder();
        expect(setButtonWhiteSpy).toHaveBeenCalled();
        expect(toolControllerSpy.setFillBorder).toHaveBeenCalled();
        expect(component.fillBorderButton).toEqual(Globals.BACKGROUND_GAINSBORO);
    });
    it('component.SetButtonsWhite shoud set white to all button', () => {
        component.setButtonsWhite();
        expect(component.fillButton).toEqual(Globals.BACKGROUND_WHITE);
        expect(component.fillBorderButton).toEqual(Globals.BACKGROUND_WHITE);
        expect(component.borderButton).toEqual(Globals.BACKGROUND_WHITE);
    });

    it('ngOnchanges should call nothing if there is no change', () => {
        setFillSpy = spyOn(component, 'setFill');
        setBorderSpy = spyOn(component, 'setBorder');
        fillBorderSpy = spyOn(component, 'setFillBorder');
        component.ngOnChanges({});
        expect(setFillSpy).not.toHaveBeenCalled();
        expect(setBorderSpy).not.toHaveBeenCalled();
        expect(fillBorderSpy).not.toHaveBeenCalled();
    });

    it('ngOnchanges should call nothing if there is a change but the tool mode isnt any of the three', () => {
        toolControllerSpy.currentTool.toolMode = ' ';
        setFillSpy = spyOn(component, 'setFill');
        setBorderSpy = spyOn(component, 'setBorder');
        fillBorderSpy = spyOn(component, 'setFillBorder');
        component.ngOnChanges({ change: new SimpleChange(null, component.change, true) });
        expect(setFillSpy).not.toHaveBeenCalled();
        expect(setBorderSpy).not.toHaveBeenCalled();
        expect(fillBorderSpy).not.toHaveBeenCalled();
    });
    it('ngOnchanges should call setFill if there is a change and the toolMode is fill', () => {
        toolControllerSpy.currentTool.toolMode = 'fill';
        setFillSpy = spyOn(component, 'setFill');
        setBorderSpy = spyOn(component, 'setBorder');
        fillBorderSpy = spyOn(component, 'setFillBorder');
        component.ngOnChanges({ change: new SimpleChange(null, component.change, true) });
        expect(setFillSpy).toHaveBeenCalled();
        expect(setBorderSpy).not.toHaveBeenCalled();
        expect(fillBorderSpy).not.toHaveBeenCalled();
    });

    it('ngOnchanges should call setBorder if there is a change and the toolMode is border', () => {
        toolControllerSpy.currentTool.toolMode = 'border';
        setFillSpy = spyOn(component, 'setFill');
        setBorderSpy = spyOn(component, 'setBorder');
        fillBorderSpy = spyOn(component, 'setFillBorder');
        component.ngOnChanges({ change: new SimpleChange(null, component.change, true) });
        expect(setFillSpy).not.toHaveBeenCalled();
        expect(setBorderSpy).toHaveBeenCalled();
        expect(fillBorderSpy).not.toHaveBeenCalled();
    });

    it('ngOnchanges should call setFillBorder if there is a change and the toolMode is fillBorder', () => {
        toolControllerSpy.currentTool.toolMode = 'fillBorder';
        setFillSpy = spyOn(component, 'setFill');
        setBorderSpy = spyOn(component, 'setBorder');
        fillBorderSpy = spyOn(component, 'setFillBorder');
        component.ngOnChanges({ change: new SimpleChange(null, component.change, true) });
        expect(setFillSpy).not.toHaveBeenCalled();
        expect(setBorderSpy).not.toHaveBeenCalled();
        expect(fillBorderSpy).toHaveBeenCalled();
    });
});
