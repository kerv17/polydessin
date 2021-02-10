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
    lastMoveEvent: MouseEvent;

    constructor(public drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;

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
        //this.pathData.push(this.pointToPush(event));
        // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        this.pathData.push(this.getPointToPush(event));
        this.drawLine(this.drawingService.previewCtx, this.pathData);
    }

    ondbClick(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.distanceBewteenPoints(this.pathData[0], mousePosition) < 20) {
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
        ctx.lineCap
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


    private getAngle(p1:Vec2, p2:Vec2):number{
        var angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
        return angleDeg;
    }


    private getShiftAngle(p1:Vec2, p2:Vec2):Vec2{
      const solution:Vec2 = {x:p1.x, y:p1.y};
      const Xquadrants:number[] = [0,7];
      const Yquadrants:number[] = [3,4];
      let angle = this.getAngle(p1, p2);
      let octant = Math.floor( Math.abs(angle/22.5) );


      if (Xquadrants.indexOf(octant)!== -1){
        solution.x = p2.x;
      }
      else if (Yquadrants.indexOf(octant)!== -1){
        solution.y = p2.y;
      }
      else {
        solution.x = p2.x;
        solution.y = (p2.y > p1.y !== p2.x < p1.x) ? p1.y + (p2.x-p1.x) : p1.y - (p2.x-p1.x);
      }
      return solution;
    }

    onShift(shifted: boolean): void {
      this.shift = shifted;
      this.onMouseMove(this.lastMoveEvent);
    }

    getPointToPush(event:MouseEvent):Vec2{
        const mousePosition = this.getPositionFromMouse(event);
        if (this.pathData.length > 0){

        let lastPointInPath = this.pathData[this.pathData.length-1];
        let shiftAngle = this.getShiftAngle(lastPointInPath,mousePosition);
        return this.shift ? shiftAngle : mousePosition;
        }
        else {
          return mousePosition;
        }
    }
}
