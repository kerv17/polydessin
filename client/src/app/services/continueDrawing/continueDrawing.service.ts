import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CanvasInformation } from '@common/communication/canvas-information';

@Injectable({
    providedIn: 'root',
})
export class ContinueDrawingService {
    private drawingSavedName: string = 'thereIsSavedDrawing';
    private continueDrawing: string = 'userWantsContinue';
    private canvasName: string = 'dessin';
    private canvasHeight: string = 'imageHeight';
    private canvasWidth: string = 'imageWidth';

    constructor(public drawingService: DrawingService) {
        addEventListener('saveState', (event: CustomEvent) => {
            this.saveCanvas();
        });
        addEventListener('continue', (event: CustomEvent) => {
            this.continueCanvas();
        });
        addEventListener('getSave', (event: CustomEvent) => {
            this.getSavedCanvas();
        });
    }
    /*
    RÉFÉRENCES POUR LE CODE DU service ContinueDrawingService:
    Le présent code est tiré du forum "How to save and load HTML5 Canvas to & from localStorage?" de la réponse de Paul, publié le 11 decemmbre 2013
    disponible à l'adresse suivante : "https://stackoverflow.com/questions/20507534/how-to-save-and-load-html5-canvas-to-from-localstorage"
    Quelques modifications y ont été apportées
*/
    private saveCanvas(): void {
        // this.drawingExists = true;
        localStorage.removeItem(this.canvasName);
        localStorage.setItem(this.canvasName, this.drawingService.canvas.toDataURL('image/'));
        localStorage.setItem(this.drawingSavedName, 'true');
        localStorage.setItem(this.canvasHeight, this.drawingService.baseCtx.canvas.height.toString());
        localStorage.setItem(this.canvasWidth, this.drawingService.baseCtx.canvas.width.toString());
    }
    private continueCanvas(): void {
        localStorage.setItem(this.continueDrawing, 'true');
    }
    getSavedCanvas(): void {
        if (!this.canvasExists() || !this.canvasContinue()) {
            return;
        }
        const dataUrl = localStorage.getItem(this.canvasName);
        const canvasHeightValue = Number(localStorage.getItem(this.canvasHeight));
        const canvasWidthValue = Number(localStorage.getItem(this.canvasWidth));
        if (dataUrl !== null) {
            const information: CanvasInformation = {
                height: canvasHeightValue,
                width: canvasWidthValue,
                imageData: dataUrl,
            } as CanvasInformation;
            this.drawingService.reloadOldCanvas(information);
        }
        // pour remetre la valeur a false pour assurer que creer un nouveaux dessin cree un nouveux dessin
        localStorage.setItem(this.continueDrawing, 'false');
    }
    canvasExists(): boolean {
        return localStorage.getItem(this.drawingSavedName) === 'true';
    }
    canvasContinue(): boolean {
        return localStorage.getItem(this.continueDrawing) === 'true';
    }
}
