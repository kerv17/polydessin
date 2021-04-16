import { Injectable } from '@angular/core';
import { ServiceCalculator } from '@app/classes/service-calculator';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MILS_TO_SEC, MouseButton } from '@app/Constants/constants';
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
    sprayAmountPerSecond: number = 100;
    lastPosition: Vec2;
    mouseDown: boolean = false;
    // tslint:disable-next-line: no-any
    timeoutID: any;
    // Fonction servant a generer un nombre aleatoire entre -max et max

    onMouseDown(event: MouseEvent): void {
        this.lastPosition = this.getPositionFromMouse(event);
        this.mouseDown = event.button === MouseButton.Left;
        this.timeoutID = setInterval(() => {
            this.onTimeout();
        }, MILS_TO_SEC / this.sprayAmountPerSecond);
        this.onTimeout();
    }

    onMouseMove(event: MouseEvent): void {
        this.lastPosition = this.getPositionFromMouse(event);
        this.showRadius(this.lastPosition, this.sprayRadius);
    }

    onTimeout(): void {
        if (this.mouseDown) {
            this.sprayPoints(this.lastPosition, this.sprayRadius);
            this.drawSpray(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown && event.button === MouseButton.Left) {
            this.drawSpray(this.drawingService.baseCtx, this.pathData);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            this.dispatchAction(this.createAction());

            this.clearPath();
            this.mouseDown = false;
            clearTimeout(this.timeoutID);
            this.onMouseMove(event);
            const eventContinue: CustomEvent = new CustomEvent('saveState');
            dispatchEvent(eventContinue);
        }
    }

    private showRadius(pos: Vec2, radius: number): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.beginPath();
        this.drawingService.previewCtx.ellipse(pos.x, pos.y, radius, radius, 0, 0, 2 * Math.PI);
        this.drawingService.previewCtx.stroke();
        this.drawSpray(this.drawingService.previewCtx, this.pathData);
    }

    sprayPoints(position: Vec2, radius: number): void {
        this.pathData.push(this.addPoint(position, radius));
    }

    addPoint(position: Vec2, radius: number): Vec2 {
        let pointToAdd: Vec2;
        let xVariation: number;
        let yVariation: number;
        do {
            xVariation = ServiceCalculator.rng(radius);
            yVariation = ServiceCalculator.rng(radius);
            pointToAdd = { x: position.x + xVariation, y: position.y + yVariation };
        } while (this.distance(xVariation, yVariation) > radius);
        return pointToAdd;
    }

    drawSpray(ctx: CanvasRenderingContext2D, points: Vec2[]): void {
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
