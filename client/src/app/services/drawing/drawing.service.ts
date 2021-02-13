import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { EditorService } from '@app/services/editor/editor.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    previewCanvas: HTMLCanvasElement;
    canvas: HTMLCanvasElement;
    canvasSize: Vec2 = { x: 0, y: 0 };
    constructor(private editor: EditorService) {}

    controlSize: Vec2 = { x: 0, y: 0 };
    // A voir
    width: number = 1;
    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }

    setSizeCanva(): Vec2 {
        const dimensionPageY = window.innerHeight;
        const dimensionPageX = window.innerWidth;
        window.alert(window.innerHeight);

        if ((dimensionPageX - Globals.SIDEBAR_WIDTH) / 2 < Globals.CANVAS_SIZE_MIN) {
            this.canvasSize.x = Globals.CANVAS_SIZE_MIN;
        } else {
            this.canvasSize.x = (dimensionPageX - Globals.SIDEBAR_WIDTH) / 2;
        }
        if (dimensionPageY / 2 < Globals.CANVAS_SIZE_MIN) {
            this.canvasSize.y = Globals.CANVAS_SIZE_MIN;
        } else {
            this.canvasSize.y = dimensionPageY / 2;
        }
        this.controlSize = this.canvasSize;
        return this.canvasSize;
    }
    // TODO à modifier
    nouveauDessin(): void {
        // Doit vérifier si la surface est vide ou non
        const image: ImageData = this.baseCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        if (this.canvasNotEmpty(image)) {
            if (!confirm('Êtes vous sur de supprimez votre dessin courant?')) {
                return;
            }
        }
        this.baseCtx.fillStyle = 'white';
        // TODO trouver vrai valeur

        this.canvas.height = this.canvasSize.y;
        this.canvas.width = this.canvasSize.x;

        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(0, 0, this.canvasSize.x, this.canvasSize.y);

        this.previewCanvas.height = this.canvasSize.y;
        this.previewCanvas.width = this.canvasSize.x;
        this.editor.resetControlPoints(this.canvasSize.x, this.canvasSize.y);
    }

    // TODO à transférer
    canvasNotEmpty(image: ImageData): boolean {
        // window.alert(image.data[image.data.length - 3]);
        const quatre = 4;
        const deuxcentcinquentcinq = 255;
        for (let i = 0; i < image.data.length; i += quatre) {
            if (image.data[i] !== deuxcentcinquentcinq || image.data[i + 1] !== deuxcentcinquentcinq || image.data[i + 2] !== deuxcentcinquentcinq) {
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
