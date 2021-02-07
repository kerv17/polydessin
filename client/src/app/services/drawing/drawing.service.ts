import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    // A voir
    width:number = 1;
    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    //est public pour etre modifier dans drawing component
    public canvasSize: Vec2 = { x: 0, y: 0 };
    // TODO à modifier
    nouveauDessin(): void {
        // Doit vérifier si la surface est vide ou non
        const image: ImageData = this.baseCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        if (this.notWhiter(image)) {
            if (confirm('Êtes vous sur de supprimez votre dessin courant?')) {
                this.clearCanvas(this.baseCtx);
                this.clearCanvas(this.previewCtx);
            }
            this.baseCtx.fillStyle = 'white';
            // TODO trouver vrai valeur
            this.baseCtx.fillRect(0, 0, 1000, 800);
        }
    }

    // TODO à transférer
    notWhiter(image: ImageData): boolean {
        // window.alert(image.data[image.data.length - 3]);

        if (image.data[1] != undefined) {
            for (let i = 0; i < image.data.length; i += 4) {
                if (image.data[i] != 255 || image.data[i + 1] != 255 || image.data[i + 2] != 255) {
                    return true;
                }
            }
        }
        return false;
    }
    setSizeCanva(dimensionPage: Vec2): void {
        if (dimensionPage.x / 2 < 250) {
            this.canvasSize.x = 250;
        }
        if (dimensionPage.y / 2 < 250) {
            this.canvasSize.y = 250;
        }
    }
}
