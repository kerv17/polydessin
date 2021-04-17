import { Injectable } from '@angular/core';
import { Setting, Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    color: string;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
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
            this.pathData.push(mousePosition);

            if (this.pathData[0].x - this.pathData[1].x === 0 && this.pathData[0].y - this.pathData[1].y === 0) {
                this.drawPixel(this.drawingService.baseCtx, this.pathData);
            }

            this.drawLine(this.drawingService.baseCtx, this.pathData);
            const action: DrawAction = this.createAction();
            this.dispatchAction(action);
        }
        this.mouseDown = false;
        this.clearPath();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const eventContinue: CustomEvent = new CustomEvent('saveState');
        dispatchEvent(eventContinue);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown) {
            this.outOfBounds = true;
        }
    }

    onMouseEnter(event: MouseEvent): void {
        this.outOfBounds = false;
    }

    private drawPixel(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.applyAttributes(ctx);
        if (ctx.lineWidth === 1) {
            ctx.fillStyle = this.color;
            ctx.fillRect(path[path.length - 1].x, path[path.length - 1].y, 1, 1);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.applyAttributes(ctx);
        const listOfPathsToDraw = this.separatePathLists(path);
        for (const list of listOfPathsToDraw) {
            ctx.beginPath();
            for (const point of list) {
                ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();
        }
    }

    private separatePathLists(path: Vec2[]): Vec2[][] {
        const pathList: Vec2[][] = [[]];
        for (const point of path) {
            if (this.isPointInRange(point)) {
                pathList[pathList.length - 1].push(point);
            } else {
                pathList.push([]);
            }
        }

        return pathList;
    }

    private isPointInRange(point: Vec2): boolean {
        const x = point.x > 0 && point.x < this.drawingService.canvas.width;
        const y = point.y > 0 && point.y < this.drawingService.canvas.height;
        return x && y;
    }

    // fonction ayant pour but de valider les valeurs de couleur et de largeur avant de les appliquer
    private applyAttributes(ctx: CanvasRenderingContext2D): void {
        ctx.lineCap = 'round';
        const width = this.width;

        if (width !== undefined && width > 0) {
            ctx.lineWidth = width;
        }

        if (this.color !== undefined && this.color !== '') {
            ctx.strokeStyle = this.color;
        }
    }

    doAction(action: DrawAction): void {
        const previousSetting: Setting = this.saveSetting();
        this.loadSetting(action.setting);

        this.drawLine(action.canvas, this.pathData);
        this.loadSetting(previousSetting);
    }
}
