import { Injectable } from '@angular/core';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
@Injectable({
    providedIn: 'root',
})
export class GridService {
    context: CanvasRenderingContext2D;
    boxSize: number = Globals.GRID_BOX_INIT_VALUE;
    opacity: number = Globals.GRID_OPACITY_INIT_VALUE;
    showGrid: boolean = false;

    constructor(public drawingService: DrawingService) {
        addEventListener('grid', (event: CustomEvent) => {
            this.drawGrid();
        });
    }
    drawGrid(): void {
        if (!this.showGrid) {
            return;
        }
        this.drawingService.clearCanvas(this.drawingService.gridCtx);
        this.context = this.drawingService.gridCtx;
        const canvasHeight = this.drawingService.canvas.height;
        const canvasWidth = this.drawingService.canvas.width;
        this.context.lineWidth = 1;
        this.context.strokeStyle = 'rgba(0,0,0,' + (this.opacity / 100).toString() + ')';
        this.context.beginPath();
        for (let x = 0; x < canvasWidth; x += this.boxSize) {
            this.context.moveTo(x, 0);
            this.context.lineTo(x, canvasHeight);
        }
        for (let y = 0; y < canvasHeight; y += this.boxSize) {
            this.context.moveTo(0, y);
            this.context.lineTo(canvasWidth, y);
        }
        this.context.stroke();
    }
    toggleGrid(): void {
        this.showGrid = !this.showGrid;
        if (this.showGrid) {
            this.drawGrid();
        } else {
            this.drawingService.clearCanvas(this.drawingService.gridCtx);
        }
    }
}
