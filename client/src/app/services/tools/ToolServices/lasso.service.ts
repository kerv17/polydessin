import { Injectable } from '@angular/core';
import { ServiceCalculator } from '@app/classes/service-calculator';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from './line-service';
import { SelectionService } from './selection.service';

@Injectable({
    providedIn: 'root',
})
export class LassoService extends Tool {
    lastMoveEvent: MouseEvent;

    constructor(drawingService: DrawingService, private lineService: LineService, private selectionService: SelectionService) {
        super(drawingService);
        this.toolMode = 'selection';
        this.clearPath();
        addEventListener('resetLassoToolMode', () => {
            this.toolMode = 'selection';
        });
    }

    onClick(event: MouseEvent): void {
        if (event.button === Globals.MouseButton.Left) {
            if (this.toolMode === 'selection') {
                this.addPoint(this.getPointToPush(event));
            }
            if (this.toolMode === 'movement') {
                this.clearPreviewCtx();
                this.passToSelectionService(this.selectArea(this.pathData));
                dispatchEvent(
                    new CustomEvent('changeTool', {
                        detail: { nextTool: [Globals.RECTANGLE_SELECTION_SHORTCUT, Globals.LASSO_SELECTION_SHORTCUT], currentTool: this },
                    }),
                );
                this.selectionService.drawBorder(this.drawingService.previewCtx, this.pathData);
                this.clearPath();
            }
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.lastMoveEvent = event;
        if (this.toolMode === 'selection' && this.pathData.length > 0) {
            this.clearPreviewCtx();
            this.lineService.drawLine(this.drawingService.previewCtx, this.pathData);
            const point = this.getPointToPush(event);
            const prevPoint = this.pathData[this.pathData.length - 1];
            this.drawingService.previewCtx.strokeStyle = this.checkIsPointValid(point) ? 'black' : 'red';
            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.lineTo(prevPoint.x, prevPoint.y);
            this.drawingService.previewCtx.lineTo(point.x, point.y);
            this.drawingService.previewCtx.stroke();
        }
    }

    onBackspace(): void {
        this.pathData.pop();
        this.onMouseMove(this.lastMoveEvent);
    }

    onEscape(): void {
        this.clearPath();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
    onShift(shifted: boolean): void {
        this.shift = shifted;
        this.onMouseMove(this.lastMoveEvent);
    }

    addPoint(point: Vec2): void {
        const closeRadius = 20;
        if (
            this.pathData.length >= 3 && // Enough points to create a shape
            ServiceCalculator.distanceBewteenPoints(point, this.pathData[0]) <= closeRadius && // Point close enough to close the shape
            this.checkIsPointValid(this.pathData[0]) // Able to be closed
        ) {
            this.pathData.push(this.pathData[0]);
            this.toolMode = 'movement';
        } else if (this.checkIsPointValid(point)) {
            this.pathData.push(point);
        }
    }

    checkIsPointValid(point: Vec2): boolean {
        if (this.pathData.length <= 1) {
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

    selectArea(points: Vec2[]): ImageData {
        const pathList = new Path2D();
        const box = ServiceCalculator.maxSize(points);
        const canvas = new OffscreenCanvas(box[1].x - box[0].x, box[1].y - box[0].y);
        const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

        for (let i = 1; i < points.length; i++) {
            pathList.lineTo(points[i].x - box[0].x, points[i].y - box[0].y);
        }
        ctx.globalCompositeOperation = 'destination-in';

        ctx.putImageData(this.drawingService.baseCtx.getImageData(box[0].x, box[0].y, box[1].x - box[0].x, box[1].y - box[0].y), 0, 0);

        ctx.fillStyle = 'black';
        ctx.fill(pathList);

        const imageData = ctx.getImageData(0, 0, box[1].x - box[0].x, box[1].y - box[0].y);

        return imageData;
    }

    passToSelectionService(data: ImageData): void {
        this.selectionService.inSelection = true;
        this.selectionService.selectedArea = data;
        this.selectionService.lassoPath = this.pathData;
        const maxSize = ServiceCalculator.maxSize(this.pathData);
        const path = [];
        path.push(maxSize[0], { x: maxSize[0].x, y: maxSize[1].y }, maxSize[1], { x: maxSize[1].x, y: maxSize[0].y });
        this.selectionService.setPathData(path);
        this.selectionService.setTopLeftHandler();
    }

    getPointToPush(event: MouseEvent): Vec2 {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.pathData.length > 0) {
            const lastPointInPath = this.pathData[this.pathData.length - 1];
            const shiftAngle = ServiceCalculator.getShiftAngle(lastPointInPath, mousePosition);
            return this.shift ? shiftAngle : mousePosition;
        } else {
            return mousePosition;
        }
    }
}
