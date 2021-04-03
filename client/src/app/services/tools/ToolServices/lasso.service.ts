import { Injectable } from '@angular/core';
import { ServiceCalculator } from '@app/classes/service-calculator';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from './line-service';

@Injectable({
    providedIn: 'root',
})
export class LassoService extends Tool {
    constructor(drawingService: DrawingService, private lineService: LineService) {
        super(drawingService);
        this.toolMode = 'selection';
        this.clearPath();
    }

    onClick(event: MouseEvent): void {
        if (this.toolMode === 'selection') {
            this.addPoint(this.getPositionFromMouse(event));
        }
        if(this.toolMode === 'movement'){
          this.clearPreviewCtx();
          this.lineService.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.toolMode === 'selection') {
            this.clearPreviewCtx();
            this.lineService.drawLine(this.drawingService.previewCtx, this.pathData);
            const point = this.getPositionFromMouse(event);
            const prevPoint = this.pathData[this.pathData.length - 1];
            this.drawingService.previewCtx.strokeStyle = this.checkIsPointValid(point) ? 'black' : 'red';
            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.lineTo(prevPoint.x, prevPoint.y);
            this.drawingService.previewCtx.lineTo(point.x, point.y);
            this.drawingService.previewCtx.stroke();
        }
    }

    addPoint(point: Vec2): void {
        // tslint:disable-next-line: no-magic-numbers
        if (this.pathData.length >= 3 && ServiceCalculator.distanceBewteenPoints(point, this.pathData[0]) <= 20) {
            this.pathData.push(this.pathData[0]);
            this.toolMode = 'movement';
        } else if (this.checkIsPointValid(point)) {
            this.pathData.push(point);
        }
    }

    checkIsPointValid(point: Vec2): boolean {
        if (this.pathData.length === 0) {
            return true;
        } else {
            return !this.intersect(point);
        }
    }

    intersect(point: Vec2): boolean {
        for (let i = 1; i < this.pathData.length - 1; i++) {
            if (ServiceCalculator.intersect([this.pathData[i], this.pathData[i - 1]], [this.pathData[this.pathData.length - 1], point])) {
                return true;
            }
        }
        return false;
    }
}
