import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    canvasSize: Vec2 = { x: 0, y: 0 };
    controlSize: Vec2 = { x: 0, y: 0 };
    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }

    setSizeCanva(): Vec2 {
        const dimensionPageY = document.documentElement.clientHeight;
        const dimensionPageX = document.documentElement.clientWidth;
        if (dimensionPageX / 2 < 250) {
            this.canvasSize.x = 250;
        } else {
            this.canvasSize.x = dimensionPageX / 2;
        }
        if (dimensionPageY / 2 < 250) {
            this.canvasSize.y = 250;
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
            if (confirm('Êtes vous sur de supprimez votre dessin courant?')) {
                this.clearCanvas(this.baseCtx);
                this.clearCanvas(this.previewCtx);
               
            }
            this.baseCtx.fillStyle = 'white';
            // TODO trouver vrai valeur
            this.baseCtx.fillRect(0, 0, this.canvasSize.x, this.canvasSize.y);
        }
    }

    // TODO à transférer
    canvasNotEmpty(image: ImageData): boolean {
        // window.alert(image.data[image.data.length - 3]);

        for (let i = 0; i < image.data.length; i += 4) {
            if (image.data[i] != 255 || image.data[i + 1] != 255 || image.data[i + 2] != 255) {
                return true;
            }
        }

        return false;
    }
}
