import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import * as Globals from '@app/Constants/constants';
import { EllipsisService } from '@app/services/tools/ToolServices/ellipsis-service';
import { LineService } from '@app/services/tools/ToolServices/line-service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { RectangleService } from '@app/services/tools/ToolServices/rectangle-service';
@Injectable({
    providedIn: 'root',
})
export class ToolControllerService {
    currentTool: Tool;
    toolMap: Map<string, Tool> = new Map();
    private escapeIsDown: boolean = false;
    private backspaceIsDown: boolean = false;
    private focused: boolean = true;

    functionMap: Map<string, (event: KeyboardEvent) => void> = new Map();
    constructor(
        private pencilService: PencilService,
        private rectangleService: RectangleService,
        private lineService: LineService,
        private ellipsisService: EllipsisService,
    ) {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.checkKeyEvent(event);
        });
        document.addEventListener('keyup', (event: KeyboardEvent) => {
            this.checkKeyEvent(event);
        });

        document.addEventListener('focusin', (event: FocusEvent) => {
            console.log(event.target, 1);
            // window.alert(event.target);
            const target = event.target;
            if (target != null) {
                this.focused = !(target instanceof HTMLInputElement);
                console.log(target instanceof HTMLInputElement);
            } else {
                this.focused = false;
            }
        });

        this.focused = true;

        this.initMap();
        this.currentTool = pencilService;
    }
    initMap(): void {
        this.toolMap
            .set(Globals.crayonShortcut, this.pencilService)
            .set(Globals.lineShortcut, this.lineService)
            .set(Globals.rectangleShortcut, this.rectangleService)
            .set(Globals.ellipsisShortcut, this.ellipsisService);

        this.functionMap
            .set(Globals.SHIFT_SHORTCUT, (event: KeyboardEvent) => {
                this.shift(event.type);
            })
            .set(Globals.ESCAPE_SHORTCUT, (event: KeyboardEvent) => {
                this.escape(event.type);
            })
            .set(Globals.BACKSPACE_SHORTCUT, (event: KeyboardEvent) => {
                this.backspace(event.type);
            });
    }

    setTool(shortcut: string): void {
        const tempTool: Tool | undefined = this.toolMap.get(shortcut);
        if (tempTool != undefined) this.currentTool = tempTool;
    }

    shift(eventType: string): void {
        this.currentTool.onShift(eventType === 'keydown');
    }
    escape(eventType: string): void {
        if (eventType === 'keydown') {
            if (!this.escapeIsDown) {
                this.currentTool.onEscape();
            }
            this.escapeIsDown = true;
        } else {
            this.escapeIsDown = false;
        }
    }
    backspace(eventType: string): void {
        if (eventType === 'keydown') {
            if (!this.backspaceIsDown) {
                this.currentTool.onBackspace();
            }
            this.backspaceIsDown = true;
        } else {
            this.backspaceIsDown = false;
        }
    }

    setFill(): void {
        this.currentTool.toolMode = 'fill';
    }

    setBorder(): void {
        this.currentTool.toolMode = 'border';
    }
    setFillBorder(): void {
        this.currentTool.toolMode = 'fillBorder';
    }

    getLineMode(): boolean {
        return this.currentTool.toolMode === 'point';
    }
    // TODO changer ca
    private checkKeyEvent(event: KeyboardEvent): void {
        if (this.focused) {
            if (this.toolMap.has(event.key)) {
                this.setTool(event.key);
                return;
            }
            if (this.functionMap.has(event.key)) {
                const functionToCall: ((event: KeyboardEvent) => void) | undefined = this.functionMap.get(event.key);
                if (functionToCall !== undefined) {
                    functionToCall.call(this, event);
                }
                return;
            }
        }
        return;
    }

    resetWidth(): void {
        Array.from(this.toolMap.values()).forEach((value) => (value.width = 1));
    }
}
