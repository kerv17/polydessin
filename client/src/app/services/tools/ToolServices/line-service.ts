import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    private pathData: Vec2[];

    constructor(public drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);

        this.pathData.push(mousePosition);

        // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawLine(this.drawingService.previewCtx, this.pathData);
        this.pathData.pop();
    }

    onClick(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.pathData.push(mousePosition);
        // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.pathData.push(mousePosition);
        this.drawLine(this.drawingService.previewCtx, this.pathData);
    }

    ondbClick(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.distanceBewteenPoints(this.pathData[0], mousePosition) < 20) {
            this.pathData.pop();
            this.pathData.pop();
            this.pathData.pop();
            this.pathData.pop();

            this.pathData.push(this.pathData[0]);
        } else {
            this.pathData.push(mousePosition);
        }

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.baseCtx.strokeStyle = sessionStorage.getItem('color') || 'black';
        this.drawLine(this.drawingService.baseCtx, this.pathData);
        this.clearPath();
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color || 'black';
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }

    private distanceBewteenPoints(a: Vec2, b: Vec2): number {
        const x = Math.abs(a.x - b.x);
        const y = Math.abs(a.y - b.y);
        const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        return distance;
    }
}
