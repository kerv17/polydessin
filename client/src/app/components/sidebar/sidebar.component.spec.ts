import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlider } from '@angular/material/slider';
import * as Globals from '@app/Constants/constants';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { SidebarComponent } from './sidebar.component';
fdescribe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    const showFillOptions = true;
    const showWidth = true;

    let openToolSpy: jasmine.Spy;
    //let nouveauDessin: jasmine.Spy;
    let toolControllerSpy: jasmine.SpyObj<ToolControllerService>;

    beforeEach(async(() => {
        toolControllerSpy = jasmine.createSpyObj(ToolControllerService, ['setTool']);
        TestBed.configureTestingModule({
            declarations: [SidebarComponent, MatSlider],
            providers: [SidebarComponent, { provide: ToolControllerService, useValue: toolControllerSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('it should give ShowWidth Visible ,fill border,reset Slider default values of false', () => {
        expect(component.visible).toEqual(false);
        expect(component.showWidth).toEqual(false);
        expect(component.resetSlider).toEqual(false);
        expect(component.fillBorder).toEqual(false);
    });

    it('it should set all the background colors of the buttons to white', () => {
        expect(component.crayon).toEqual(Globals.backgroundWhite);
        expect(component.rectangle).toEqual(Globals.backgroundWhite);
        expect(component.line).toEqual(Globals.backgroundWhite);
        expect(component.ellipsis).toEqual(Globals.backgroundWhite);
    });

    it('OpenCrayon should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');

        component.openCrayon();

        expect(component.crayon).toEqual(Globals.backgroundGainsoboro);
        expect(openToolSpy).toHaveBeenCalledWith(!showFillOptions, showWidth);
        expect(toolControllerSpy.setTool).toHaveBeenCalledWith(Globals.crayonShortcut);
    });

    it('OpenRectangle should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');
        component.openRectangle();
        expect(openToolSpy).toHaveBeenCalledWith(showFillOptions, showWidth);
        expect(component.rectangle).toEqual(Globals.backgroundGainsoboro);
        expect(toolControllerSpy.setTool).toHaveBeenCalledWith(Globals.rectangleShortcut);
    });

    it('OpenRectangle should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');
        component.openRectangle();
        expect(openToolSpy).toHaveBeenCalledWith(showFillOptions, showWidth);
        expect(component.rectangle).toEqual(Globals.backgroundGainsoboro);
        expect(toolControllerSpy.setTool).toHaveBeenCalledWith(Globals.rectangleShortcut);
    });
    it('OpenLine should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');
        component.openLine();
        expect(openToolSpy).toHaveBeenCalledWith(!showFillOptions, showWidth);
        expect(component.line).toEqual(Globals.backgroundGainsoboro);
        expect(toolControllerSpy.setTool).toHaveBeenCalledWith(Globals.lineShortcut);
    });
    it('OpenEllipsis should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');
        component.openEllipsis();
        expect(openToolSpy).toHaveBeenCalledWith(showFillOptions, showWidth);
        expect(component.ellipsis).toEqual(Globals.backgroundGainsoboro);
        expect(toolControllerSpy.setTool).toHaveBeenCalledWith(Globals.ellipsisShortcut);
    });
    it('OpenTool should flip the slider status variable and se showWidth and FillBorder', () => {
        openToolSpy = spyOn(component, 'setButtonWhite');
        const tempSlidervalue = component.resetSlider;
        component.openTool(showFillOptions, showWidth);
        expect(openToolSpy).toHaveBeenCalled();
        expect(component.fillBorder).toEqual(showFillOptions);
        expect(component.showWidth).toEqual(showWidth);
        expect(component.resetSlider).toEqual(!tempSlidervalue);
    });
});
