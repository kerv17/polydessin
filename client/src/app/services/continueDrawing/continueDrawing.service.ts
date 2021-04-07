import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ContinueDrawingService {
    drawingExists: boolean = false;
    canvasName: string = 'dessin';

    constructor(public drawingService: DrawingService) {
        addEventListener('saveState', (event: CustomEvent) => {
            this.saveCanvas();
        });
    }
    /*
    RÉFÉRENCES POUR LE CODE DU service ContinueDrawingService:
    Le présent code est tiré du forum "How to save and load HTML5 Canvas to & from localStorage?" de la réponse de Paul, publié le 11 decemmbre 2013
    disponible à l'adresse suivante : "https://stackoverflow.com/questions/20507534/how-to-save-and-load-html5-canvas-to-from-localstorage"
    Quelques modifications y ont été apportées
*/
    private saveCanvas(): void {
        this.drawingExists = true;
        localStorage.setItem(this.canvasName, this.drawingService.canvas.toDataURL());
    }
    getSavedCanvas(): void {
        const dataUrl = localStorage.getItem(this.canvasName);
        const image = new Image();
        if (dataUrl !== null) {
            image.src = dataUrl;
            this.drawingService.baseCtx.drawImage(image, 0, 0);
        }
    }
}
