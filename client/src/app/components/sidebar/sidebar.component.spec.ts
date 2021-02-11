import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as Globals from '@app/Constants/constants';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { SidebarComponent } from './sidebar.component';
fdescribe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    const showFillOptions = true;
    const showWidth = true;

    let openToolSpy: jasmine.Spy;

    let toolControllerSpy: jasmine.SpyObj<ToolControllerService>;

    beforeEach(async(() => {
        toolControllerSpy = jasmine.createSpyObj(ToolControllerService, ['setTool']);
        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
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

    it('OpenCrayon should change the ngSyle variable and call SetTool and OpenTool', () => {
        openToolSpy = spyOn(component, 'openTool');

        component.openCrayon();

        expect(component.crayon).toEqual(Globals.backgroundGainsoboro);
        expect(openToolSpy).toHaveBeenCalledWith(!showFillOptions, showWidth);
        expect(toolControllerSpy.setTool).toHaveBeenCalledWith(Globals.crayonShortcut);
    });
});
