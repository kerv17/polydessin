import { Injectable } from '@angular/core';
import { ServiceCalculator } from '@app/classes/service-calculator';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from './line-service';
import { SelectionService } from './selection.service';
import * as Globals from '@app/Constants/constants';

@Injectable({
    providedIn: 'root',
})
export class LassoService extends Tool {
    constructor(drawingService: DrawingService, private lineService: LineService, private selectionService:SelectionService) {
        super(drawingService);
        this.toolMode = 'selection';
        this.clearPath();
    }

    onClick(event: MouseEvent): void {
        if (this.toolMode === 'selection') {
            this.addPoint(this.getPositionFromMouse(event));
        }
        if (this.toolMode === 'movement') {
            this.clearPreviewCtx();
            this.passToSelectionService(this.selectArea(this.pathData));
            dispatchEvent(new CustomEvent('changeTool', {detail: [Globals.RECTANGLE_SELECTION_SHORTCUT, Globals.LASSO_SELECTION_SHORTCUT]}));
            this.clearPath();
            // this.selectionService.updateCanvasOnMove(this.drawingService.previewCtx);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.toolMode === 'selection' && this.pathData.length > 0) {
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

    selectArea(points: Vec2[]): ImageData {
        const pathList = new Path2D();
        const box = ServiceCalculator.maxSize(points);
        const canvas = new OffscreenCanvas(box[1].x - box[0].x, box[1].y - box[0].y);
        const ctx = canvas.getContext('2d') || new OffscreenCanvasRenderingContext2D();
        
        for (let i = 1; i < points.length; i++) {
            pathList.lineTo(points[i].x - box[0].x, points[i].y - box[0].y);
        }

        ctx.globalCompositeOperation = 'destination-in';

        ctx.putImageData(this.drawingService.baseCtx.getImageData(box[0].x, box[0].y, box[1].x - box[0].x, box[1].y - box[0].y), 0, 0);

        ctx.fillStyle = 'black';
        ctx.fill(pathList);

        const imageData = ctx.getImageData(0, 0, box[1].x - box[0].x, box[1].y - box[0].y);

        //this.clearPreviewCtx();
        this.clearZone();
        return imageData;
    }

    

    passToSelectionService(ctx:ImageData){
        this.selectionService.inSelection = true;
        this.selectionService.inMovement = true;
        this.selectionService.selectedArea = ctx;
        this.selectionService.lassoPath = this.pathData;
        this.selectionService.setPathData(ServiceCalculator.maxSize(this.pathData));
        this.selectionService.setTopLeftHandler();
        
    }

    clearZone(): void {
        this.drawingService.baseCtx.fillStyle = 'white';
        const path = new Path2D();
        path.moveTo(this.pathData[0].x, this.pathData[0].y)
        for (let i = 1; i < this.pathData.length; i++) {
            path.lineTo(this.pathData[i].x, this.pathData[i].y);
        }
        this.drawingService.baseCtx.fill(path);
    }
}
