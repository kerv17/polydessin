import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionResizeService } from '@app/services/selection-resize/selection-resize.service';
@Injectable({
    providedIn: 'root',
})
export class SelectionMovementService {
    private initialMousePosition: Vec2 = { x: 0, y: 0 };
    private leftArrow: boolean = false;
    private downArrow: boolean = false;
    private rightArrow: boolean = false;
    private upArrow: boolean = false;
    private timeout: number = 0;
    private interval: number = 0;
    private keyDown: boolean = false;
    private firstTime: boolean = true;

    constructor(private drawingService: DrawingService, private selectionResize: SelectionResizeService) {}

    onMouseDown(event: MouseEvent, mousePosition: Vec2, topLeft: Vec2, width: number, height: number): boolean {
        const bottomRight = { x: topLeft.x + width, y: topLeft.y + height };
        if (mousePosition.x > topLeft.x && mousePosition.x < bottomRight.x && mousePosition.y > topLeft.y && mousePosition.y < bottomRight.y) {
            this.initialMousePosition = { x: event.x, y: event.y };
            return true;
        } else {
            return false;
        }
    }

    onMouseMove(event: MouseEvent, ctx: CanvasRenderingContext2D, topLeft: Vec2, selectedArea: ImageData): void {
        const deplacement: Vec2 = { x: event.x - this.initialMousePosition.x, y: event.y - this.initialMousePosition.y };
        const position: Vec2 = { x: topLeft.x + deplacement.x, y: topLeft.y + deplacement.y };
        ctx.putImageData(selectedArea, position.x, position.y);
    }

    onMouseUp(event: MouseEvent, topLeft: Vec2, path: Vec2[]): Vec2 {
        const deplacement: Vec2 = { x: event.x - this.initialMousePosition.x, y: event.y - this.initialMousePosition.y };
        const position: Vec2 = { x: topLeft.x + deplacement.x, y: topLeft.y + deplacement.y };
        this.initialMousePosition = { x: 0, y: 0 };
        if (path.length > Globals.CURRENT_SELECTION_POSITION) {
            path.pop();
        }
        path.push(position);
        return position;
    }

    isArrowKeyDown(event: KeyboardEvent): boolean {
        let isKeyEvent = false;
        if (event.key === 'ArrowLeft') {
            this.leftArrow = true;
            isKeyEvent = true;
        }
        if (event.key === 'ArrowUp') {
            this.upArrow = true;
            isKeyEvent = true;
        }
        if (event.key === 'ArrowRight') {
            this.rightArrow = true;
            isKeyEvent = true;
        }
        if (event.key === 'ArrowDown') {
            this.downArrow = true;
            isKeyEvent = true;
        }
        return isKeyEvent;
    }

    onArrowKeyUp(event: KeyboardEvent): void {
        this.keyDown = false;
        this.firstTime = true;
        clearInterval(this.interval);
        clearTimeout(this.timeout);

        if (event.key === 'ArrowLeft') {
            this.leftArrow = false;
        }
        if (event.key === 'ArrowUp') {
            this.upArrow = false;
        }
        if (event.key === 'ArrowRight') {
            this.rightArrow = false;
        }
        if (event.key === 'ArrowDown') {
            this.downArrow = false;
        }
    }

    moveSelection(path: Vec2[]): void {
        let topLeft = { x: path[0].x, y: path[0].y };
        if (path.length > Globals.CURRENT_SELECTION_POSITION) {
            topLeft = { x: path[Globals.CURRENT_SELECTION_POSITION].x, y: path[Globals.CURRENT_SELECTION_POSITION].y };
            path.pop();
        }
        if (this.leftArrow) {
            topLeft.x -= Globals.PIXELS_MOVE_SELECTION;
        }
        if (this.upArrow) {
            topLeft.y -= Globals.PIXELS_MOVE_SELECTION;
        }
        if (this.rightArrow) {
            topLeft.x += Globals.PIXELS_MOVE_SELECTION;
        }
        if (this.downArrow) {
            topLeft.y += Globals.PIXELS_MOVE_SELECTION;
        }
        path.push(topLeft);
    }

    updateCanvasOnMove(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.fillRect(path[0].x, path[0].y, path[2].x - path[0].x, path[2].y - path[0].y);
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
    }

    onArrowDown(repeated: boolean, selectedArea: ImageData, pathData: Vec2[]): void {
        if (repeated) {
            this.setKeyMovementDelays(selectedArea, pathData);
        } else {
            this.drawSelection(selectedArea, pathData);
        }
    }

    private setKeyMovementDelays(selectedArea: ImageData, pathData: Vec2[]): void {
        if (this.keyDown) {
            if (this.firstTime) {
                this.firstTime = false;
                this.interval = window.setInterval(() => {
                    this.drawSelection(selectedArea, pathData);
                }, Globals.INTERVAL_MS);
            }
        } else {
            this.timeout = window.setTimeout(() => {
                this.keyDown = true;
            }, Globals.TIMEOUT_MS);
        }
    }

    private drawSelection(selectedArea: ImageData, pathData: Vec2[]): void {
        if (selectedArea !== undefined) {
            this.moveSelection(pathData);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.updateCanvasOnMove(this.drawingService.previewCtx, pathData);
            this.drawingService.previewCtx.putImageData(
                selectedArea,
                pathData[Globals.CURRENT_SELECTION_POSITION].x,
                pathData[Globals.CURRENT_SELECTION_POSITION].y,
            );
            this.selectionResize.setPathDataAfterMovement(pathData[Globals.CURRENT_SELECTION_POSITION]);
        }
    }
}
