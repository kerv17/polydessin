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
    constructor(
        private pencilService: PencilService,
        private rectangleService: RectangleService,
        private lineService: LineService,
        private ellipsisService: EllipsisService,
    ) {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.checkKeyDown(event);
        });
        document.addEventListener('keyup', (event: KeyboardEvent) => {
            this.checkKeyUp(event);
        });
        this.initMap();
    }
    initMap(): void {
        this.toolMap
            .set(Globals.crayonShortcut, this.pencilService)
            .set(Globals.lineShortcut, this.lineService)
            .set(Globals.rectangleShortcut, this.rectangleService)
            .set(Globals.ellipsisShortcut, this.ellipsisService);
    }

    setTool(shortcut: string): void {
        const tempTool: Tool | undefined = this.toolMap.get(shortcut);
        if (tempTool != undefined) this.currentTool = tempTool;
    }

    shift(shift: boolean): void {
        this.currentTool.onShift(shift);
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
    // TODO changé ca
    private checkKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'c':
                this.setTool(Globals.crayonShortcut);
                break;
            case '1':
                this.setTool(Globals.rectangleShortcut);
                break;
            case '2':
                this.setTool(Globals.ellipsisShortcut);
                break;
            case 'l':
                this.setTool(Globals.lineShortcut);
                break;
            case 'Shift':
                this.shift(true);
                break;
            default:
                break;
        }
        return;
    }

    private checkKeyUp(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Shift':
                this.shift(false);
                break;
            default:
                break;
        }
        return;
    }
}
