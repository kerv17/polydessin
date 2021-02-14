import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { ColorComponent } from '@app/components/color/color.component';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EditorService } from '@app/services/editor/editor.service';
import { EditorComponent } from './editor.component';
class ToolStub extends Tool {}

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    const editorService: EditorService = new EditorService();

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService);
        drawingStub = new DrawingService(editorService);

        TestBed.configureTestingModule({
            declarations: [EditorComponent, SidebarComponent, DrawingComponent, ColorComponent],
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
