import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

// TODO : Déplacer ça dans un fichier séparé accessible par tous

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class EllipsisService extends Tool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
    }
    private pathData: Vec2[];
    private perimerterPathData: Vec2[];
    lastMoveEvent: MouseEvent;

    getPerimeterPathData(): Vec2[] {
        return this.perimerterPathData;
    }

    getPath(): Vec2[] {
        return this.pathData;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === Globals.MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.perimerterPathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.getRectanglePoints(mousePosition);
            this.getPathForEllipsis(mousePosition);
            this.drawEllipse(this.drawingService.baseCtx, this.pathData);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastMoveEvent = event;
            const mousePosition = this.getPositionFromMouse(event);
            this.getRectanglePoints(mousePosition);
            this.getPathForEllipsis(mousePosition);

            const a = this.pathData[0];
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            this.drawEllipse(this.drawingService.previewCtx, this.pathData);
            this.clearPath();
            this.pathData.push(a);
            this.perimerterPathData.push(a);
        }
    }

    onShift(shifted: boolean): void {
        this.shift = shifted;
        this.onMouseMove(this.lastMoveEvent);
    }

    private drawEllipse(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.width;
        // Determiner si on doit faire la bordure

        switch (this.toolMode) {
            case 'border':
                this.drawBorder(ctx, path);
                break;
            case 'fill':
                this.fill(ctx, path);
                break;
            case 'fillBorder':
                this.fill(ctx, path);
                this.drawBorder(ctx, path);
                break;
        }

        ctx.stroke();
        this.drawPerimeter(this.drawingService.previewCtx, this.perimerterPathData);
        ctx.stroke();
    }

    private drawBorder(ctx: CanvasRenderingContext2D, path: Vec2[], col: string = this.color2 || 'black'): void {
        ctx.strokeStyle = col;
        ctx.lineWidth = this.width;
        const a: Vec2 = path[1];
        const c: Vec2 = path[2];
        ctx.beginPath();
        const ellipseWidth = this.ellipseWidth(a, c);
        ctx.ellipse(a.x, a.y, ellipseWidth.x, ellipseWidth.y, 0, 0, 2 * Math.PI);
    }

    private fill(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.fillStyle = this.color || 'black';
        this.drawBorder(ctx, path, this.color);
        ctx.fill();
    }

    private clearPath(): void {
        this.pathData = [];
        this.perimerterPathData = [];
    }

    private getPathForEllipsis(mousePosition: Vec2): void {
        const a: Vec2 = this.pathData[0];
        const c: Vec2 = !this.shift ? mousePosition : this.perimerterPathData[2];
        const b: Vec2 = { x: a.x + (c.x - a.x) / 2, y: a.y + (c.y - a.y) / 2 };
        this.pathData.push(b);
        this.pathData.push(c);
    }

    private drawPerimeter(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
    }

    private getRectanglePoints(mousePosition: Vec2): void {
        const list: Vec2[] = [];

        const a: Vec2 = this.perimerterPathData[0];
        const b: Vec2 = { x: a.x, y: mousePosition.y };
        const c: Vec2 = mousePosition;
        const d: Vec2 = { x: mousePosition.x, y: a.y };

        if (this.shift) {
            const onTopRightDiagonal = mousePosition.x < a.x !== mousePosition.y < a.y;
            c.x = onTopRightDiagonal ? a.x + -(b.y - a.y) : a.x + b.y - a.y;
            d.x = onTopRightDiagonal ? a.x + -(b.y - a.y) : a.x + b.y - a.y;
        }

        list.push(a, b, c, d);
        this.perimerterPathData = list;
    }

    ellipseWidth(a: Vec2, c: Vec2): Vec2 {
        const x = c.x - a.x < 0 ? Math.abs(c.x - a.x + this.width / 2) : Math.abs(c.x - a.x - this.width / 2);
        const y = c.y - a.y < 0 ? Math.abs(c.y - a.y + this.width / 2) : Math.abs(c.y - a.y - this.width / 2);
        const s: Vec2 = { x, y };

        return s;
    }
}
