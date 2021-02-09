import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { EllipsisService } from '@app/services/tools/ToolServices/ellipsis-service';
import { LineService } from '@app/services/tools/ToolServices/line-service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { RectangleService } from '@app/services/tools/ToolServices/rectangle-service';

@Injectable({
    providedIn: 'root',
})
export class ToolControllerService {
    currentTool: Tool;
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
    }

    setCrayon(): void {
        this.currentTool = this.pencilService;
    }

    setRectangle(): void {
        this.currentTool = this.rectangleService;
    }

    setEllipse(): void {
        this.currentTool = this.ellipsisService;
    }

    setLine(): void {
        this.currentTool = this.lineService;
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

    private checkKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'c':
                this.setCrayon();
                break;
            case '1':
                this.setRectangle();
                break;
            case '2':
                this.setEllipse();
                break;
            case 'l':
                this.setLine();
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
