import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MILS_TO_SEC } from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class AerosolService extends Tool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
    }

    sprayRadius: number = 50;
    sprayAmountPerSecond: number = 10;
    lastPosition: Vec2;
    mouseDown: boolean = false;
    timeoutID: any;
    // Fonction servant a generer un nombre aleatoire entre -max et max
    rng(max: number): number {
        return Math.floor((Math.random() - 1.0 / 2.0) * 2 * max);
    }

    onMouseDown(event: MouseEvent): void {
        this.lastPosition = this.getPositionFromMouse(event);
        this.mouseDown = true;
        this.timeoutID = setInterval(() => {
            this.onTimeout();
        }, MILS_TO_SEC / this.sprayAmountPerSecond);
        this.onTimeout();
    }

    onMouseMove(event: MouseEvent): void {
        this.lastPosition = this.getPositionFromMouse(event);
        this.showRadius(this.getPositionFromMouse(event), this.sprayRadius);
    }

    onTimeout() {
        if (this.mouseDown) {
            this.sprayPoints(this.lastPosition, this.sprayRadius, this.sprayAmountPerSecond);
            this.drawSpray(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawSpray(this.drawingService.baseCtx, this.pathData);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            this.dispatchAction(this.createAction());

            this.clearPath();
            this.mouseDown = false;
            clearTimeout(this.timeoutID);
            this.onMouseMove(event);
        }
    }

    private showRadius(pos: Vec2, radius: number): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.beginPath();
        this.drawingService.previewCtx.ellipse(pos.x, pos.y, radius, radius, 0, 0, 2 * Math.PI);
        this.drawingService.previewCtx.stroke();
        this.drawSpray(this.drawingService.previewCtx, this.pathData);
    }

    sprayPoints(position: Vec2, radius: number, amount: number): void {
        this.pathData.push(this.addPoint(position, radius));
    }

    addPoint(position: Vec2, radius: number): Vec2 {
        let pointToAdd: Vec2;
        let xVariation: number;
        let yVariation: number;
        do {
            xVariation = this.rng(radius);
            yVariation = this.rng(radius);
            pointToAdd = { x: position.x + xVariation, y: position.y + yVariation };
        } while (this.distance(xVariation, yVariation) > radius);
        return pointToAdd;
    }

    drawSpray(ctx: CanvasRenderingContext2D, points: Vec2[]):void {
        ctx.strokeStyle = ctx.strokeStyle = this.color || 'black';
        ctx.fillStyle = this.color || 'black';
        for (const point of points) {
            ctx.beginPath();
            ctx.ellipse(point.x, point.y, this.width, this.width, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
    }

    distance(x: number, y: number): number {
        const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        return distance;
    }

    doAction(action: DrawAction): void {
        const previousSetting = this.saveSetting();
        this.loadSetting(action.setting);
        this.drawSpray(action.canvas, this.pathData);
        this.loadSetting(previousSetting);
    }
}
