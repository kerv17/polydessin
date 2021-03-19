import { Injectable } from '@angular/core';
import { Setting, Tool } from '@app/classes/tool';
import { EditorComponent } from '@app/components/editor/editor.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizedEvent } from 'angular-resize-event';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    pile: CanvasAction[];
    currentLocation: number = 0;
    startImage: ImageData;

    constructor(private drawingService: DrawingService) {
        this.pile = [{} as CanvasAction];
        this.startImage = { data: new Uint8ClampedArray([0, 0, 0, 0]), width: 1, height: 1 };

        /*
        To avoid using recursive dependencies, we should look into
        using events to send actions from tools to this service.

        I do not know yet how custom events work, but it is worth looking into
        */
        addEventListener('action', (event: CustomEvent) => {
            this.addAction(event.detail);
        });
        addEventListener('keypress', (event: KeyboardEvent) => {
            this.onKeyPress(event);
        });
        addEventListener('undoRedoWipe', (event: CustomEvent) => {
            this.pile = [{} as CanvasAction];
            this.sendUndoButtonState();
        });
    }

    onKeyPress(event: KeyboardEvent): void {
        const keypressed = event.key.toLocaleLowerCase();
        if (keypressed === 'z' && event.ctrlKey && !event.shiftKey) {
            this.undo();
        }
        if (keypressed === 'z' && event.ctrlKey && event.shiftKey) {
            this.redo();
        }
    }

    undo(): void {
        if (this.currentLocation > 0) {
            this.currentLocation--;

            this.drawingService.resetCanvas();
            this.drawingService.baseCtx.putImageData(this.startImage,0,0);
            for (let i = 1; i <= this.currentLocation; i++) {
                this.doAction(this.pile[i]);
            }
        }
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
        if (action.type === 'Draw') {
            const drawAction: DrawAction = action as DrawAction;
            drawAction.tool.doAction(drawAction);
        } else if (action.type === 'Resize') {
            const resizeAction: ResizeAction = action as ResizeAction;
            resizeAction.resizer.onResize(resizeAction.event);
            // console.log(this.pile);
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

export interface ResizeAction extends CanvasAction {
    resizer: EditorComponent;
    event: ResizedEvent;
}
