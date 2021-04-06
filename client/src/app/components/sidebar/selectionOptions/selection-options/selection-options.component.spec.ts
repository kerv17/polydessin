import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';
import { SelectionBoxService } from '@app/services/selection-box/selection-box.service';
import { SelectionMovementService } from '@app/services/selection-movement/selection-movement.service';
import { SelectionResizeService } from '@app/services/selection-resize/selection-resize.service';
import { ClipboardService } from '@app/services/tools/ToolServices/clipboard/clipboard.service';
import { SelectionService } from '@app/services/tools/ToolServices/selection.service';
import { SelectionOptionsComponent } from './selection-options.component';

export class DrawingServiceStub extends DrawingService {
    newCanvas(): void {
        return;
    }
}

// tslint:disable: no-any
describe('SelectionOptionsComponent', () => {
    let component: SelectionOptionsComponent;
    let fixture: ComponentFixture<SelectionOptionsComponent>;
    let clipboardService: ClipboardService;
    let drawingStub: DrawingServiceStub;
    let selectionMoveService: SelectionMovementService;
    let selectionResizeService: SelectionResizeService;
    let selectionBoxService: SelectionBoxService;
    let selectionService: SelectionService;
    let clipboardSpy: jasmine.Spy;
    const checkKeyEvent = 'checkKeyEvent';

    beforeEach(async(() => {
        drawingStub = new DrawingServiceStub({} as ResizePoint);
        selectionBoxService = new SelectionBoxService();
        selectionResizeService = new SelectionResizeService(selectionBoxService);
        selectionMoveService = new SelectionMovementService(drawingStub, selectionResizeService);
        selectionService = new SelectionService(drawingStub, selectionMoveService, selectionResizeService);
        clipboardService = new ClipboardService(drawingStub, selectionMoveService, selectionService);
        selectionService.inSelection = false;
        TestBed.configureTestingModule({
            declarations: [SelectionOptionsComponent],
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: ClipboardService, useValue: clipboardService },
                { provide: SelectionMovementService, useValue: selectionMoveService },
                { provide: SelectionResizeService, useValue: selectionResizeService },
                { provide: SelectionBoxService, useValue: selectionBoxService },
                { provide: SelectionService, useValue: selectionService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectionOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('EventListener should call checkKeyEvent', () => {
        const checkKeyEventSpy = spyOn<any>(component, 'checkKeyEvent');
        const keyEventData = { isTrusted: true, key: '67', ctrlKey: true };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        document.dispatchEvent(keyDownEvent);
        expect(checkKeyEventSpy).toHaveBeenCalled();
    });

    it('checkKeyEvent should call the copy method from clipboard if CTRL+C was pressed', () => {
        clipboardSpy = spyOn(clipboardService, 'copy');
        const keyEventData = { isTrusted: true, key: Globals.COPY_SHORTCUT, ctrlKey: true };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        component[checkKeyEvent](keyDownEvent);
        expect(clipboardSpy).toHaveBeenCalled();
    });

    it('checkKeyEvent should call the paste method from clipboard if CTRL+V was pressed', () => {
        clipboardSpy = spyOn(clipboardService, 'paste');
        const keyEventData = { isTrusted: true, key: Globals.PASTE_SHORTCUT, ctrlKey: true };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        component[checkKeyEvent](keyDownEvent);
        expect(clipboardSpy).toHaveBeenCalled();
    });

    it('checkKeyEvent should call the cut method from clipboard if CTRL+X was pressed', () => {
        clipboardSpy = spyOn(clipboardService, 'cut');
        const keyEventData = { isTrusted: true, key: Globals.CUT_SHORTCUT, ctrlKey: true };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        component[checkKeyEvent](keyDownEvent);
        expect(clipboardSpy).toHaveBeenCalled();
    });

    it('checkKeyEvent should call the delete method from clipboard if DELETE was pressed', () => {
        clipboardSpy = spyOn(clipboardService, 'delete');
        const keyEventData = { isTrusted: true, key: 'Delete', ctrlKey: false };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        component[checkKeyEvent](keyDownEvent);
        expect(clipboardSpy).toHaveBeenCalled();
    });

    it('checkKeyEvent should do nothing if none of the 4 actions were triggered', () => {
        clipboardSpy = spyOn(clipboardService, 'copy');
        const keyEventData = { isTrusted: true, key: '65', ctrlKey: false };
        const keyDownEvent = new KeyboardEvent('keydown', keyEventData);
        component[checkKeyEvent](keyDownEvent);
        expect(clipboardSpy).not.toHaveBeenCalled();
        clipboardSpy = spyOn(clipboardService, 'paste');
        component[checkKeyEvent](keyDownEvent);
        expect(clipboardSpy).not.toHaveBeenCalled();
        clipboardSpy = spyOn(clipboardService, 'cut');
        component[checkKeyEvent](keyDownEvent);
        expect(clipboardSpy).not.toHaveBeenCalled();
        clipboardSpy = spyOn(clipboardService, 'delete');
        component[checkKeyEvent](keyDownEvent);
        expect(clipboardSpy).not.toHaveBeenCalled();
    });
});
