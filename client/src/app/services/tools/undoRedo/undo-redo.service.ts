import { Injectable } from '@angular/core';
import { Setting, Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    pile: DrawAction[];
    currentLocation: number = 0;

    constructor() {
        this.pile = [{} as DrawAction];

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
    }

    onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'z' && event.ctrlKey && !event.shiftKey) {
            this.undo();
        }
        if (event.key === 'z' && event.ctrlKey && event.shiftKey) {
            this.redo();
        }
    }

    undo(): void {
        if (this.currentLocation > 0) {
            this.currentLocation--;

            const drawingService: DrawingService = this.pile[1].tool.drawingService;
            drawingService.resetCanvas();
            for (let i = 1; i <= this.currentLocation; i++) {
                this.doAction(this.pile[i]);
            }
        }
    }

    redo(): void {
        if (this.currentLocation < this.pile.length - 1) {
            this.currentLocation++;
            const action = this.pile[this.currentLocation];
            this.doAction(action);
        }
    }

    addAction(action: DrawAction): void {
        console.log(action);
        if (this.currentLocation < this.pile.length - 1) {
            this.pile = this.pile.slice(0, this.currentLocation + 1);
        }
        this.pile.push(action);
        this.currentLocation++;
    }

    doAction(action: DrawAction): void {
        const tool = action.tool;
        tool.doAction(action);
    }
}

export interface DrawAction {
    tool: Tool;
    setting: Setting;
    canvas: CanvasRenderingContext2D;
}
