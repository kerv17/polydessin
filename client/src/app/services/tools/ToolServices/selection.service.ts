import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from './rectangle-service';

@Injectable({
    providedIn: 'root',
})
export class SelectionService extends Tool {
    rectangleService: RectangleService;
    lastMoveEvent: MouseEvent;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
        this.rectangleService = new RectangleService(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === Globals.MouseButton.Left;
        this.rectangleService.onMouseDown(event);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            const vec: Vec2[] = this.rectangleService.getRectanglePoints(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawSelectionBox(this.drawingService.previewCtx, vec);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastMoveEvent = event;
            const mousePosition = this.getPositionFromMouse(event);
            const vec: Vec2[] = this.rectangleService.getRectanglePoints(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawBorder(this.drawingService.previewCtx, vec);
            this.drawArea(this.drawingService.previewCtx, this.selectArea(this.drawingService.baseCtx, vec));
            this.clearPath();
            this.pathData.push(vec[0]);
        }
    }

    onShift(shifted: boolean): void {
        this.rectangleService.shift = shifted;
        this.onMouseMove(this.lastMoveEvent);
    }

    private drawBorder(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.width;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.setLineDash([10, 10]);
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([0, 0]);
    }

    // on escape

    // selection des pixels
    private selectArea(ctx: CanvasRenderingContext2D, path: Vec2[]): ImageData {
        const width: number = path[2].x - path[0].x;
        const height: number = path[2].y - path[0].y;
        return ctx.getImageData(path[0].x, path[0].y, width, height);
    }

    // test
    private drawArea(ctx: CanvasRenderingContext2D, selection: ImageData): void {
        ctx.putImageData(selection, 0, 0);
    }

    // selectionner tout le canvas avec Ctrl + A
    selectCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): ImageData {
        return ctx.getImageData(0, 0, width, height);
    }

    // cadre avec les 8 pts de selection
    private drawSelectionBox(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.width;
        ctx.stroke();
    }
}
