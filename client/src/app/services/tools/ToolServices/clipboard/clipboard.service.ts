import { Injectable } from '@angular/core';
import { Setting, Tool } from '@app/classes/tool';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionMovementService } from '@app/services/selection-movement/selection-movement.service';
import { SelectionService } from '@app/services/tools/ToolServices/selection.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService extends Tool {
    private clipboard: ImageData;

    constructor(drawingService: DrawingService, private selectionMove: SelectionMovementService, private selection: SelectionService) {
        super(drawingService);
    }

    getClipboardStatus(): boolean {
        if (this.clipboard !== undefined) {
            return true;
        }
        return false;
    }

    getSelectionStatus(): boolean {
        return this.selection.inSelection;
    }

    doAction(action: DrawAction): void {
        const previousSetting: Setting = this.saveSetting();
        this.loadSetting(action.setting);
        this.selectionMove.updateCanvasOnMove(this.drawingService.baseCtx, this.pathData);
        this.loadSetting(previousSetting);
    }

    copy(): void {
        if (this.selection.inSelection) {
            this.clipboard = new ImageData(this.selection.selectedArea.data, this.selection.selectedArea.width, this.selection.selectedArea.height);
        }
    }

    paste(): void {
        if (this.clipboard !== undefined) {
            if (this.getSelectionStatus()) {
                this.selection.onEscape();
            }
            this.selection.selectedArea = new ImageData(this.clipboard.data, this.clipboard.width, this.clipboard.height);
            this.selection.drawingService.previewCtx.putImageData(this.clipboard, 0, 0);
            this.fakePath();
            this.selection.inSelection = true;
        }
    }

    cut(): void {
        if (this.selection.inSelection) {
            this.copy();
            this.delete();
        }
    }

    delete(): void {
        if (this.selection.inSelection) {
            this.pathData = this.selection.getPathData();
            this.selectionMove.updateCanvasOnMove(this.drawingService.baseCtx, this.pathData);
            this.selectionMove.updateCanvasOnMove(this.drawingService.previewCtx, this.pathData);
            this.dispatchAction(this.createAction());
            this.selection.clearPath();
            this.selection.inSelection = false;
        }
    }

    private fakePath(): void {
        this.selection.getPathData()[0] = { x: this.selection.drawingService.canvas.width, y: this.selection.drawingService.canvas.height };
        this.selection.getPathData()[1] = {
            x: this.selection.drawingService.canvas.width,
            y: this.selection.drawingService.canvas.height + this.clipboard.height,
        };
        this.selection.getPathData()[2] = {
            x: this.selection.drawingService.canvas.width + this.clipboard.width,
            y: this.selection.drawingService.canvas.height + this.clipboard.height,
        };
        this.selection.getPathData()[Globals.RIGHT_HANDLER] = {
            x: this.selection.drawingService.canvas.width + this.clipboard.width,
            y: this.selection.drawingService.canvas.height,
        };
        this.selection.getPathData()[Globals.CURRENT_SELECTION_POSITION] = { x: 0, y: 0 };
    }
}
