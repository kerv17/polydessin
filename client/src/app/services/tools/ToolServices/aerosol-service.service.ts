import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class AerosolService extends Tool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
    }

    sprayRadius: number = 50;
    sprayAmountPerSecond: number = 50;
    pointWidth = 3;

    // Fonction servant a generer un nombre aleatoire entre -max et max
    rng(max: number): number {
        return Math.floor(Math.random() * (2 * max) - max);
    }

    onMouseDown(event: MouseEvent): void {
        const position = this.getPositionFromMouse(event);
        this.spray(position, this.sprayRadius, this.sprayAmountPerSecond);
        console.log(position,this.pathData);
    }

    onMouseMove(event: MouseEvent): void {
      this.showRadius(this.getPositionFromMouse(event),this.sprayRadius);
    }


    private showRadius(pos:Vec2, radius:number){
      this.drawingService.clearCanvas(this.drawingService.previewCtx);
      this.drawingService.previewCtx.beginPath();
      this.drawingService.previewCtx.ellipse(pos.x, pos.y, radius, radius, 0, 0, 2 * Math.PI);
      this.drawingService.previewCtx.stroke();
      this.drawSpray(this.drawingService.previewCtx);
    }

    private spray(position: Vec2, radius: number, amount: number): void {
        for (let i = 0; i < amount; i++) {
            this.pathData.push(this.addPoint(position, radius));
        }
        this.drawSpray(this.drawingService.previewCtx);
    }

    private addPoint(position: Vec2, radius: number): Vec2 {
        const pointToAdd: Vec2 = { x: position.x + this.rng(radius), y: position.y + this.rng(radius) };
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
}
