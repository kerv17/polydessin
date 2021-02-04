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
    private perimerterPathData:Vec2[];

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

            let a = this.pathData[0];
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);


            this.drawEllipse(this.drawingService.previewCtx, this.pathData);
            this.clearPath();
            this.pathData.push(a);
            this.perimerterPathData.push(a);
        }
    }

    onShift(shifted:boolean){
      this.shift = shifted;
      this.onMouseMove(this.lastMoveEvent);
    }



    private drawEllipse(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.drawingService.width;
2
       //Determiner si on doit faire la bordure
       if (this.toolMode == "border" || this.toolMode == "fillBorder"){
         this.drawBorder(ctx,path);
       }

       //Determiner si on doit fill le rectangle
       if (this.toolMode == "fill" || this.toolMode == "fillBorder"){
        this.fill(ctx,path);
      }
        ctx.stroke();
      this.drawPerimeter(this.drawingService.previewCtx,this.perimerterPathData);
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
        this.perimerterPathData = [];
    }


    private getPathForEllipsis(mousePosition:Vec2){
      let a: Vec2 = this.pathData[0];
            let c: Vec2 = mousePosition;
            if (this.shift){
              c = this.perimerterPathData[2];
            }
            let bx:number = a.x+ (c.x-a.x)/2;
            let by:number = a.y+ (c.y-a.y)/2;
            let b: Vec2 = {x:bx,y:by};
            this.pathData.push(b);
            this.pathData.push(c);
    }

    private drawPerimeter(ctx: CanvasRenderingContext2D, path: Vec2[]):void {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const point of path) {
          ctx.lineTo(point.x, point.y);
      }
      ctx.closePath();
    }

    private getRectanglePoints(mousePosition:Vec2){
      let list:Vec2[] = [];

      let a: Vec2 = this.perimerterPathData[0];
      let b: Vec2 = { x: a.x, y: mousePosition.y};
      let c: Vec2 = mousePosition;
      let d: Vec2 = { x: mousePosition.x, y: a.y };

      if (this.shift){
        if (mousePosition.x < a.x !=  mousePosition.y < a.y){
          c = {x:(a.x+ -(b.y-a.y)),y:mousePosition.y };
          d = {x:(a.x+ -(b.y-a.y)),y:a.y };
        }

        else{
          c = {x:(a.x+ b.y-a.y),y:mousePosition.y };
          d = {x:(a.x+ b.y-a.y),y:a.y };
        }
      }

      list.push(a,b,c,d);
      this.perimerterPathData = list;

    }

}
