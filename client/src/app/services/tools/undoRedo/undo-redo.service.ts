import { Injectable } from '@angular/core';
import { Setting, Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CanvasInformation } from '@common/communication/canvas-information';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    pile: CanvasAction[];
    currentLocation: number = 0;
    startImage: CanvasInformation;

    constructor(private drawingService: DrawingService) {
        this.pile = [{} as CanvasAction];

        /*
        To avoid using recursive dependencies, we should look into
        using events to send actions from tools to this service.

        I do not know yet how custom events work, but it is worth looking into
        */
        addEventListener('action', (event: CustomEvent) => {
            this.addAction(event.detail);
        });

        addEventListener('undoRedoWipe', (event: CustomEvent) => {
            this.resetPile(event.detail);
        });
    }

    undo(): void {
        if (this.currentLocation > 0) {
            this.currentLocation--;
            this.drawingService.setCanvassSize(this.drawingService.setSizeCanva());
            for (let i = 0; i <= this.currentLocation; i++) {
                this.doAction(this.pile[i]);
            }
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.sendUndoButtonState();
    }

    redo(): void {
        if (this.currentLocation < this.pile.length - 1) {
            this.currentLocation++;
            const action = this.pile[this.currentLocation];
            this.doAction(action);
        }
        this.sendUndoButtonState();
    }

    resetPile(info: DrawingAction): void {
        this.pile = [info];
        this.currentLocation = 0;
        this.sendUndoButtonState();
    }

    sendUndoButtonState(): void {
        const c: CustomEvent = new CustomEvent('undoRedoState', {
            detail: [this.currentLocation > 0, this.currentLocation < this.pile.length - 1],
        });
        dispatchEvent(c);
    }

    addAction(action: DrawAction): void {
        if (this.currentLocation < this.pile.length - 1) {
            this.pile = this.pile.slice(0, this.currentLocation + 1);
        }
        this.pile.push(action);
        this.currentLocation++;
        this.sendUndoButtonState();
    }

    doAction(action: CanvasAction): void {
        switch (action.type) {
            case 'Draw':
                const drawAction: DrawAction = action as DrawAction;
                drawAction.tool.doAction(drawAction);
                break;
            case 'Drawing':
                const event: CustomEvent = new CustomEvent('allowUndoCall', { detail: false });
                dispatchEvent(event);
                const drawingAction: DrawingAction = action as DrawingAction;
                this.drawingService.resetCanvas({ x: drawingAction.width, y: drawingAction.height });
                this.drawingService.resizePoint.resetControlPoints(drawingAction.width, drawingAction.height);
                this.drawingService.baseCtx.putImageData(drawingAction.drawing, 0, 0);

                break;
            default:
                break;
        }
    }
    // function doAction(action: ResizeAction):void
}

export interface CanvasAction {
    type: string;
}

export interface DrawAction extends CanvasAction {
    tool: Tool;
    setting: Setting;
    canvas: CanvasRenderingContext2D;
}
export interface DrawingAction extends CanvasAction {
    drawing: ImageData;
    width: number;
    height: number;
}
