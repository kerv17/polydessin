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
            let a: Vec2 = this.pathData[this.pathData.length - 1];
            let b: Vec2 = { x: a.x, y: mousePosition.y };
            let c: Vec2 = mousePosition;
            let d: Vec2 = { x: mousePosition.x, y: a.y };

            //Les ajoute au dessin
            this.pathData.push(b);
            this.pathData.push(c);
            this.pathData.push(d);
            this.pathData.push(a);

            this.drawRectangle(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastMoveEvent = event;
            const mousePosition = this.getPositionFromMouse(event);
            let a: Vec2 = this.pathData[this.pathData.length - 1];
            let b: Vec2 = { x: a.x, y: mousePosition.y };
            let c: Vec2 = mousePosition;
            let d: Vec2 = { x: mousePosition.x, y: a.y };
            if (this.shift){
              c = {x:(a.x+ b.y-a.y),y:mousePosition.y };
              d = {x:(a.x+ b.y-a.y),y:a.y };
            }
            this.pathData.push(b);
            this.pathData.push(c);
            this.pathData.push(d);
            this.pathData.push(a);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawRectangle(this.drawingService.previewCtx, this.pathData);
            this.drawingService.previewCtx.clearRect(0,0,1000,1000);
            this.pathData.push(a);
        }
    }

    onShift(shifted:boolean){
      this.shift = shifted;
      this.onMouseMove(this.lastMoveEvent);
    }



    private drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = parseInt(sessionStorage.getItem('width') || '1');

        //Determiner si on doit fill le rectangle
        if (this.toolMode == "fill" || this.toolMode == "fillBorder"){
          this.fill(ctx,path);
        }



       //Determiner si on doit faire la bordure
       if (this.toolMode == "border" || this.toolMode == "fillBorder"){
         this.drawBorder(ctx,path);
       }

        ctx.stroke();
    }

    private drawBorder(ctx: CanvasRenderingContext2D, path: Vec2[]):void {
      ctx.strokeStyle = this.color2 || "black";
      let a:Vec2  = path[0];
      let c:Vec2 = path[2];
      ctx.ellipse(a.x,a.y,(c.x)-(a.x),(c.y)-(a.y),1,0,2*Math.PI);
    }

    private fill(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
      let widhtHeight:Vec2 = {x:path[2].x-path[0].x , y: path[2].y-path[0].y};
      ctx.fillStyle= this.color || "black";
      ctx.fillRect(path[0].x,path[0].y,widhtHeight.x, widhtHeight.y);
    }


    private clearPath(): void {
        this.pathData = [];
    }
}
