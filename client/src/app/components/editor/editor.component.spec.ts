import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
//import { DrawingComponent } from '@app/components/drawing/drawing.component';
//import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EditorComponent } from './editor.component';
class ToolStub extends Tool {}

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService);
        drawingStub = new DrawingService();

        TestBed.configureTestingModule({
            declarations: [EditorComponent],
            providers: [
                { provide: Tool, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
            ],
        }).compileComponents();
    }));


    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
