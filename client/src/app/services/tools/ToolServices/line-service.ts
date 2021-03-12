import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';

// TODO : Déplacer ça dans un fichier séparé accessible par tous

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    lastMoveEvent: MouseEvent;

    constructor(public drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
        this.toolMode = 'noPoint';
        this.pointWidth = 1;
    }
    onMouseMove(event: MouseEvent): void {
        this.lastMoveEvent = event;
        this.pathData.push(this.getPointToPush(event));
        // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawLine(this.drawingService.previewCtx, this.pathData);
        this.pathData.pop();
    }

    onClick(event: MouseEvent): void {
        // this.pathData.push(this.pointToPush(event));
        // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.pathData.push(this.getPointToPush(event));
        this.drawLine(this.drawingService.previewCtx, this.pathData);
    }

    ondbClick(event: MouseEvent): void {
        // Removes the last 2 points, one for each added by solo click of the dbClick
        this.pathData.pop();
        this.pathData.pop();
        if (this.pathData.length > 0) {
            const SNAP_RANGE = 20;
            const mousePosition = this.getPositionFromMouse(event);
            if (this.distanceBewteenPoints(this.pathData[0], mousePosition) < SNAP_RANGE) {
                this.pathData.push(this.pathData[0]);
            } else {
                this.pathData.push(this.getPointToPush(event));
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
            this.dispatchAction(this.createAction());

            this.clearPath();
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color || 'black';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        if (this.toolMode === 'point') {
            this.drawDot(ctx, path);
        }
    }

    private drawDot(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.strokeStyle = this.color2 || 'black';
        ctx.fillStyle = this.color2 || 'black';

        for (const point of path) {
            ctx.beginPath();
            ctx.ellipse(point.x, point.y, this.pointWidth, this.pointWidth, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
    }

    private distanceBewteenPoints(a: Vec2, b: Vec2): number {
        const x = Math.abs(a.x - b.x);
        const y = Math.abs(a.y - b.y);
        const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        return distance;
    }

    private getAngle(p1: Vec2, p2: Vec2): number {
        const HALF_CIRCLE_DEG = 180;
        const angleDeg = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * HALF_CIRCLE_DEG) / Math.PI;
        return angleDeg;
    }

    private getShiftAngle(p1: Vec2, p2: Vec2): Vec2 {
        const solution: Vec2 = { x: p1.x, y: p1.y };

        const NOT_IN_INDEX = -1;

        // tslint:disable: no-magic-numbers
        const X_QUADRANTS: number[] = [0, 7];
        const Y_QUADRANTS: number[] = [3, 4];
        // tslint:enable: no-magic-numbers
        const HALF_QUADRANTS = 22.5;
        const angle = this.getAngle(p1, p2);
        const octant = Math.floor(Math.abs(angle / HALF_QUADRANTS));

        if (X_QUADRANTS.indexOf(octant) !== NOT_IN_INDEX) {
            solution.x = p2.x;
        } else if (Y_QUADRANTS.indexOf(octant) !== NOT_IN_INDEX) {
            solution.y = p2.y;
        } else {
            solution.x = p2.x;
            solution.y = p2.y > p1.y !== p2.x < p1.x ? p1.y + (p2.x - p1.x) : p1.y - (p2.x - p1.x);
        }
        return solution;
    }

    onShift(shifted: boolean): void {
        this.shift = shifted;
        this.onMouseMove(this.lastMoveEvent);
    }
    onEscape(): void {
        this.clearPath();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
    onBackspace(): void {
        this.pathData.pop();
        this.onMouseMove(this.lastMoveEvent);
    }

    getPointToPush(event: MouseEvent): Vec2 {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.pathData.length > 0) {
            const lastPointInPath = this.pathData[this.pathData.length - 1];
            const shiftAngle = this.getShiftAngle(lastPointInPath, mousePosition);
            return this.shift ? shiftAngle : mousePosition;
        } else {
            return mousePosition;
        }
    }

    doAction(action: DrawAction): void {
        const previousSetting = this.saveSetting();
        this.loadSetting(action.setting);
        this.drawLine(action.canvas, this.pathData);
        this.loadSetting(previousSetting);
    }
}
