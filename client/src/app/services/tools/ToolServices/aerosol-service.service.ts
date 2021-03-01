import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MILS_TO_SEC } from '@app/Constants/constants';

@Injectable({
    providedIn: 'root',
})
export class AerosolService extends Tool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
    }

    sprayRadius: number = 50;
    sprayAmountPerSecond: number = 10;
    pointWidth = 3;
    lastPosition:Vec2;
    mouseDown = false;
    timeoutID:any;
    // Fonction servant a generer un nombre aleatoire entre -max et max
    rng(max: number): number {
        return Math.floor(Math.random() * (2 * max) - max);
    }


    onMouseDown(event: MouseEvent): void {
        this.lastPosition = this.getPositionFromMouse(event);
        this.mouseDown = true;
        this.timeoutID = setInterval(()=>{this.onTimeout();},MILS_TO_SEC);
        this.onTimeout();
    }

    onMouseMove(event: MouseEvent): void {
      this.lastPosition = this.getPositionFromMouse(event);
      this.showRadius(this.getPositionFromMouse(event),this.sprayRadius);
      //this.onTimeout();
    }

    onTimeout(){

      if (this.mouseDown){
        this.sprayPoints(this.lastPosition,this.sprayRadius,this.sprayAmountPerSecond);
        this.drawSpray(this.drawingService.previewCtx);
      }
    }

    onMouseUp(event: MouseEvent):void{
        this.drawSpray(this.drawingService.baseCtx);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.clearPath();
        this.mouseDown = false;
        clearTimeout(this.timeoutID);
    }


    private showRadius(pos:Vec2, radius:number){
      this.drawingService.clearCanvas(this.drawingService.previewCtx);
      this.drawingService.previewCtx.beginPath();
      this.drawingService.previewCtx.ellipse(pos.x, pos.y, radius, radius, 0, 0, 2 * Math.PI);
      this.drawingService.previewCtx.stroke();
      this.drawSpray(this.drawingService.previewCtx);
    }

    private sprayPoints(position: Vec2, radius: number, amount: number): void {
        for (let i = 0; i < amount; i++) {
            this.pathData.push(this.addPoint(position, radius));
        }
    }

    private addPoint(position: Vec2, radius: number): Vec2 {
        let pointToAdd: Vec2
        let xVariation: number;
        let yVariation: number;
        do{
            xVariation = this.rng(radius);
            yVariation = this.rng(radius);
            pointToAdd = { x: position.x + xVariation, y: position.y + yVariation };
        }while(this.distance(xVariation, yVariation)>radius);
        return pointToAdd;
    }

    drawSpray(ctx:CanvasRenderingContext2D){
      ctx.strokeStyle = ctx.strokeStyle = this.color || 'black';
      ctx.fillStyle = this.color || 'black';
      for(const point of this.pathData){
          ctx.beginPath();
          ctx.ellipse(point.x, point.y, this.pointWidth, this.pointWidth, 0, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
      }
    }

    private distance(x: number,y: number):number {
        const distance = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
        return distance;
    }
}
