import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CanvasInformation } from '@common/communication/canvas-information';

@Injectable({
    providedIn: 'root',
})
export class ContinueDrawingService {
    private drawingSavedName: string = 'thereIsSavedDrawing';
    private continueDrawing: string = 'userWantsContinue';
    private canvasName: string = 'drawing';
    private canvasHeight: string = 'imageHeight';
    private canvasWidth: string = 'imageWidth';

    constructor(public drawingService: DrawingService) {
        addEventListener('saveState', (event: CustomEvent) => {
            this.saveCanvas();
        });
        addEventListener('continue', (event: CustomEvent) => {
            this.continueCanvas();
        });
        addEventListener('newCanvas', (event: CustomEvent) => {
            this.newCanvas();
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
        sessionStorage.removeItem(this.canvasName);
        sessionStorage.setItem(this.canvasName, this.drawingService.canvas.toDataURL('image/'));
        sessionStorage.setItem(this.drawingSavedName, 'true');
        sessionStorage.setItem(this.canvasHeight, this.drawingService.baseCtx.canvas.height.toString());
        sessionStorage.setItem(this.canvasWidth, this.drawingService.baseCtx.canvas.width.toString());
    }
    private continueCanvas(): void {
        sessionStorage.setItem(this.continueDrawing, 'true');
    }
    private newCanvas(): void {
        sessionStorage.clear();
    }
    getSavedCanvas(): void {
        if (!this.canvasExists() || !this.canvasContinue()) {
            return;
        }
        const dataUrl = sessionStorage.getItem(this.canvasName);
        const canvasHeightValue = Number(sessionStorage.getItem(this.canvasHeight));
        const canvasWidthValue = Number(sessionStorage.getItem(this.canvasWidth));
        if (dataUrl !== null) {
            const information: CanvasInformation = {
                height: canvasHeightValue,
                width: canvasWidthValue,
                imageData: dataUrl,
            } as CanvasInformation;
            this.insertSavedCanvas(information);
        }
        // pour remetre la valeur a false pour assurer que creer un nouveaux dessin cree un nouveux dessin
        sessionStorage.setItem(this.continueDrawing, 'false');
    }
    canvasExists(): boolean {
        return sessionStorage.getItem(this.drawingSavedName) === 'true';
    }
    canvasContinue(): boolean {
        return sessionStorage.getItem(this.continueDrawing) === 'true';
    }
    private insertSavedCanvas(oldCanvas: CanvasInformation): void {
        const newSize: Vec2 = { x: oldCanvas.width, y: oldCanvas.height };

        this.drawingService.setCanvassSize(newSize);
        const image = new Image();
        image.src = oldCanvas.imageData;
        window.setTimeout(() => {
            this.drawingService.baseCtx.drawImage(image, 0, 0);
        }, 0);
    }
}
