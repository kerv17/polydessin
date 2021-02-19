import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { ResizePoint } from '@app/services/resize-Point/resize-point.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    previewCanvas: HTMLCanvasElement;
    canvas: HTMLCanvasElement;
    canvasSize: Vec2 = { x: 0, y: 0 };

    constructor(public resizePoint: ResizePoint) {}

    controlSize: Vec2 = { x: 0, y: 0 };
    // A voir
    width: number = 1;
    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }

    setSizeCanva(vec: Vec2 = this.canvasSize): Vec2 {
        const dimensionPageY: number = window.innerHeight;
        const dimensionPageX: number = window.innerWidth;

        if ((dimensionPageX - Globals.SIDEBAR_WIDTH) / 2 < Globals.CANVAS_SIZE_MIN) {
            vec.x = Globals.CANVAS_SIZE_MIN;
        } else {
            vec.x = (dimensionPageX - Globals.SIDEBAR_WIDTH) / 2;
        }
        if (dimensionPageY / 2 < Globals.CANVAS_SIZE_MIN) {
            vec.y = Globals.CANVAS_SIZE_MIN;
        } else {
            vec.y = dimensionPageY / 2;
        }
        this.controlSize.x = vec.x;
        this.controlSize.y = vec.y;
        return vec;
    }

    newCanvas(): void {
        let newCanvasSize: Vec2 = { x: 0, y: 0 };
        newCanvasSize = this.setSizeCanva(newCanvasSize);

        const image: ImageData = this.baseCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        if (this.canvasNotEmpty(image)) {
            if (!confirm('Êtes vous sur de supprimez votre dessin courant?')) {
                return;
            }
        }
        this.canvas.height = newCanvasSize.y;
        this.canvas.width = newCanvasSize.x;

        this.previewCanvas.height = newCanvasSize.y;
        this.previewCanvas.width = newCanvasSize.x;
        this.clearCanvas(this.previewCtx);
        this.resizePoint.resetControlPoints(this.canvas.width, this.canvas.height);
        this.baseCtx.fillStyle = 'white';

        this.baseCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    canvasNotEmpty(image: ImageData): boolean {
        for (let i = 0; i < image.data.length; i += Globals.PIXEL_SIZE) {
            if (image.data[i] !== Globals.WHITE || image.data[i + 1] !== Globals.WHITE || image.data[i + 2] !== Globals.WHITE) {
                return true;
            }
        }

        return false;
    }

    fillNewSpace(canvasPreviousDimension: Vec2, canvasNewDimension: Vec2): void {
        this.baseCtx.fillStyle = 'white';
        if (canvasPreviousDimension.x < canvasNewDimension.x) {
            this.baseCtx.fillRect(canvasPreviousDimension.x, 0, canvasNewDimension.x, canvasPreviousDimension.y);
        }
        if (canvasPreviousDimension.y < canvasNewDimension.y) {
            this.baseCtx.fillRect(0, canvasPreviousDimension.y, canvasNewDimension.x, canvasNewDimension.y);
        }
    }
}
