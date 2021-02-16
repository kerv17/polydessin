import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as Globals from '@app/Constants/constants';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { ShapeOptionsComponent } from './shape-options.component';
describe('ShapeOptionsComponent', () => {
    let component: ShapeOptionsComponent;
    let fixture: ComponentFixture<ShapeOptionsComponent>;
    let toolControllerSpy: jasmine.SpyObj<ToolControllerService>;
    let setButtonWhiteSpy: jasmine.Spy;
    beforeEach(async(() => {
        toolControllerSpy = jasmine.createSpyObj('ToolControllerService', ['setFill', 'setBorder', 'setFillBorder']);
        TestBed.configureTestingModule({
            declarations: [ShapeOptionsComponent],
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
});
