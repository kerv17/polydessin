import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
    }
    lastMoveEvent: MouseEvent;
    getPath(): Vec2[] {
        return this.pathData;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === Globals.MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);

            // Va chercher les 4 coins du rectangle
            const vec: Vec2[] = this.getRectanglePoints(mousePosition);
            this.drawRectangle(this.drawingService.baseCtx, vec);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastMoveEvent = event;
            const mousePosition = this.getPositionFromMouse(event);
            const vec: Vec2[] = this.getRectanglePoints(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawRectangle(this.drawingService.previewCtx, vec);
            this.clearPath();
            this.pathData.push(vec[0]);
        }
    }

    onShift(shifted: boolean): void {
        this.shift = shifted;
        this.onMouseMove(this.lastMoveEvent);
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.width;

        // Determiner si on doit fill le rectangle
        if (this.toolMode === 'fill' || this.toolMode === 'fillBorder') {
            this.fill(ctx, path);
        }

        // Determiner si on doit faire la bordure
        if (this.toolMode === 'border' || this.toolMode === 'fillBorder') {
            this.drawBorder(ctx, path);
            ctx.stroke();
        }
    }

    private drawBorder(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.strokeStyle = this.color2 || 'black';
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
    }

    private fill(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const widhtHeight: Vec2 = { x: path[2].x - path[0].x, y: path[2].y - path[0].y };
        ctx.fillStyle = this.color || 'black';
        ctx.fillRect(path[0].x, path[0].y, widhtHeight.x, widhtHeight.y);
    }

    getRectanglePoints(mousePosition: Vec2): Vec2[] {
        const list: Vec2[] = [];
        const a: Vec2 = this.pathData[this.pathData.length - 1];
        const b: Vec2 = { x: a.x, y: mousePosition.y };
        let c: Vec2 = mousePosition;
        let d: Vec2 = { x: mousePosition.x, y: a.y };
        if (this.shift) {
            if (mousePosition.x < a.x !== mousePosition.y < a.y) {
                c = { x: a.x + -(b.y - a.y), y: mousePosition.y };
                d = { x: a.x + -(b.y - a.y), y: a.y };
            } else {
                c = { x: a.x + b.y - a.y, y: mousePosition.y };
                d = { x: a.x + b.y - a.y, y: a.y };
            }
        }
        list.push(a, b, c, d);

        return list;
    }
}
