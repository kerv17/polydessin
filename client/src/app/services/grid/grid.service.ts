import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
@Injectable({
    providedIn: 'root',
})
export class GridService {
    context: CanvasRenderingContext2D;
    private boxSize: number;
    showGrid: boolean = false;

    constructor(public drawingService: DrawingService) {
        addEventListener('grid', (event: CustomEvent) => {
            this.drawGrid();
        });
    }
    drawGrid(): void {
        this.boxSize = 20;
        this.showGrid = true;
        if (!this.showGrid) {
            return;
        }
        this.context = this.drawingService.gridCtx;
        const canvasHeight = this.drawingService.canvas.height;
        const canvasWidth = this.drawingService.canvas.width;
        this.context.lineWidth = 0.25;
        // this.context.fillStyle = 'rgba(200,20,70,1)';
        // this.context.fillRect(10, 10, 55, 50);
        this.context.strokeStyle = 'black';
        this.context.beginPath();
        for (let x = 0; x < canvasWidth; x += this.boxSize) {
            this.context.moveTo(x, 0);
            this.context.lineTo(x, canvasHeight);
            this.context.stroke();
        }
        for (let y = 0; y < canvasHeight; y += this.boxSize) {
            this.context.moveTo(0, y);
            this.context.lineTo(canvasWidth, y);
            this.context.stroke();
        }
        // this.context.stroke();
    }
    // currentlyNothing(): void {}
}
