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
export class EllipsisService extends Tool {
    private pathData: Vec2[];
    public getPath():Vec2[]{
        return this.pathData;
    }
    public lastMoveEvent:MouseEvent;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);

            //Va chercher les 4 coins du rectangle
            let a: Vec2 = this.pathData[0];
            let c: Vec2 = mousePosition;
            if (this.shift){
              c = {x:(a.x+ mousePosition.y-a.y),y:mousePosition.y };
            }
            let bx:number = a.x+ (c.x-a.x)/2;
            let by:number = a.y+ (c.y-a.y)/2;
            let b: Vec2 = {x:bx,y:by};
            this.pathData.push(b);
            this.pathData.push(c);
            this.drawRectangle(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastMoveEvent = event;
            const mousePosition = this.getPositionFromMouse(event);
            let a: Vec2 = this.pathData[0];
            let c: Vec2 = mousePosition;
            if (this.shift){
              c = {x:(a.x+ mousePosition.y-a.y),y:mousePosition.y };
            }
            let bx:number = a.x+ (c.x-a.x)/2;
            let by:number = a.y+ (c.y-a.y)/2;
            let b: Vec2 = {x:bx,y:by};
            this.pathData.push(b);
            this.pathData.push(c);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawRectangle(this.drawingService.previewCtx, this.pathData);
            this.clearPath();
            this.pathData.push(a);
        }
    }

    onShift(shifted:boolean){
      this.shift = shifted;
      this.onMouseMove(this.lastMoveEvent);
    }



    private drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = parseInt(sessionStorage.getItem('width') || '1');





       //Determiner si on doit faire la bordure
       if (this.toolMode == "border" || this.toolMode == "fillBorder"){
         this.drawBorder(ctx,path);
       }

       //Determiner si on doit fill le rectangle
       if (this.toolMode == "fill" || this.toolMode == "fillBorder"){
        this.fill(ctx,path);
      }

        ctx.stroke();
    }

    private drawBorder(ctx: CanvasRenderingContext2D, path: Vec2[]):void {
      ctx.strokeStyle = this.color2 || "black";
      let a:Vec2  = path[1];
      let c:Vec2 = path[2];
      ctx.beginPath();
      ctx.ellipse(a.x,a.y,Math.abs((c.x)-(a.x)),Math.abs((c.y)-(a.y)),0,0,2*Math.PI);
    }

    private fill(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.fillStyle = this.color || "black";
        ctx.fill();
    }


    private clearPath(): void {
        this.pathData = [];
    }
}
