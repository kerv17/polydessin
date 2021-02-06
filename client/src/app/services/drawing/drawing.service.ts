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
    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // est public pour etre modifier dans drawing component
    setSizeCanva(): Vec2 {
        window.alert(document.documentElement.clientHeight);
        const dimensionPageY: number = document.documentElement.clientHeight;
        const dimensionPageX: number = document.documentElement.clientWidth;
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
        return this.canvasSize;
    }
    // utiliser 3 au lieux de 2 pour un 1080p
    initialBottomControl(): Vec2 {
        const currentCanvasSize: Vec2 = this.setSizeCanva();
        currentCanvasSize.x *= 0.5;
        currentCanvasSize.y -= 2;
        return currentCanvasSize;
    }
    initialSideControl(): Vec2 {
        const currentCanvasSize: Vec2 = this.setSizeCanva();
        currentCanvasSize.x -= 2;
        currentCanvasSize.y *= 0.5;
        return currentCanvasSize;
    }
    initialCornerControl(): Vec2 {
        const currentCanvasSize: Vec2 = this.setSizeCanva();
        currentCanvasSize.x -= 2;
        currentCanvasSize.y -= 2;
        return currentCanvasSize;
    }
}
