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

    // est public pour etre modifier dans drawing component
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
        // initialise valeurs points de controle
        this.controlSize = this.canvasSize;
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

    resizeFunct(e: MouseEvent): void {
        this.controlSize.y = e.pageY;
    }
    stopResize(e: MouseEvent): void {
        window.removeEventListener('mousemove', this.resizeFunct);
        this.canvasSize = this.controlSize;
    }
    resizeBottomControl() {
        const resizer = document.querySelector('ResizerBottomLine');
        if (resizer != null) {
            resizer.addEventListener('mousedown', (e: MouseEvent): void => {
                e.preventDefault();

                window.addEventListener('mousemove', this.resizeFunct);
                window.addEventListener('mouseup', this.stopResize);
            });
        }
    }
}
