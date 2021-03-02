import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import * as Globals from '@app/Constants/constants';
import { EllipsisService } from '@app/services/tools/ToolServices/ellipsis-service';
import { LineService } from '@app/services/tools/ToolServices/line-service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { RectangleService } from '@app/services/tools/ToolServices/rectangle-service';
import {AerosolService} from '@app/services/tools/ToolServices/aerosol-service.service';
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
        private aerosolService: AerosolService
    ) {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.checkKeyEvent(event);
        });
        document.addEventListener('keyup', (event: KeyboardEvent) => {
            this.checkKeyEvent(event);
        });

        document.addEventListener('focusin', (event: FocusEvent) => {
            this.checkFocus(event);
        });

        this.initMap();
        this.currentTool = pencilService;
    }
    initMap(): void {
        this.toolMap
            .set(Globals.CRAYON_SHORTCUT, this.pencilService)
            .set(Globals.LINE_SHORTCUT, this.lineService)
            .set(Globals.RECTANGLE_SHORTCUT, this.rectangleService)
            .set(Globals.ELLIPSIS_SHORTCUT, this.ellipsisService)
            .set(Globals.AEROSOL_SHORTCUT, this.aerosolService);

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

    checkFocus(event: FocusEvent): void {
        const target = event.target;
        this.focused = !(target instanceof HTMLInputElement);
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
            } else {
                this.functionMap.get(event.key)?.call(this, event);
                return;
            }
        }
        return;
    }

    resetWidth(): void {
        Array.from(this.toolMap.values()).forEach((value) => (value.width = 1));
    }

    getTool(toolShortcut: string):Tool{
        if(this.toolMap.has(toolShortcut)){
          return this.toolMap.get(toolShortcut) as Tool;
        }
        else return this.pencilService;
    }
}
