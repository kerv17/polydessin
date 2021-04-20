import { Injectable } from '@angular/core';
import { ServiceCalculator } from '@app/classes/service-calculator';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    lastMoveEvent: MouseEvent;

    constructor(public drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
        this.toolMode = 'noPoint';
        this.pointWidth = 1;
    }
    onMouseMove(event: MouseEvent): void {
        this.lastMoveEvent = event;
        this.pathData.push(this.getPointToPush(event));
        // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawLine(this.drawingService.previewCtx, this.pathData);
        this.pathData.pop();
    }

    onClick(event: MouseEvent): void {
        // this.pathData.push(this.pointToPush(event));
        // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
        if (event.button === Globals.MouseButton.Left) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.pathData.push(this.getPointToPush(event));
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    ondbClick(event: MouseEvent): void {
        // Removes the last 2 points, one for each added by solo click of the dbClick

        if (event.button === Globals.MouseButton.Left) {
            this.pathData.pop();
            this.pathData.pop();
            if (this.pathData.length > 0) {
                const SNAP_RANGE = 20;
                const mousePosition = this.getPositionFromMouse(event);
                if (ServiceCalculator.distanceBewteenPoints(this.pathData[0], mousePosition) < SNAP_RANGE) {
                    this.pathData.push(this.pathData[0]);
                } else {
                    this.pathData.push(this.getPointToPush(event));
                }
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawLine(this.drawingService.baseCtx, this.pathData);
                this.dispatchAction(this.createAction());

                this.clearPath();
                const eventContinue: CustomEvent = new CustomEvent('saveState');
                dispatchEvent(eventContinue);
            }
        }
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color || 'black';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        if (this.toolMode === 'point') {
            this.drawDot(ctx, path);
        }
    }

    private drawDot(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.strokeStyle = this.color2 || 'black';
        ctx.fillStyle = this.color2 || 'black';

        for (const point of path) {
            ctx.beginPath();
            ctx.ellipse(point.x, point.y, this.pointWidth, this.pointWidth, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
    }

    onShift(shifted: boolean): void {
        this.shift = shifted;
        this.onMouseMove(this.lastMoveEvent);
    }
    onEscape(): void {
        this.clearPath();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
    onBackspace(): void {
        this.pathData.pop();
        this.onMouseMove(this.lastMoveEvent);
    }

    private getPointToPush(event: MouseEvent): Vec2 {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.pathData.length > 0) {
            const lastPointInPath = this.pathData[this.pathData.length - 1];
            const shiftAngle = ServiceCalculator.getShiftAngle(lastPointInPath, mousePosition);
            return this.shift ? shiftAngle : mousePosition;
        } else {
            return mousePosition;
        }
    }

    doAction(action: DrawAction): void {
        const previousSetting = this.saveSetting();
        this.loadSetting(action.setting);
        this.drawLine(action.canvas, this.pathData);
        this.loadSetting(previousSetting);
    }
}
