import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    
    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    //est public pour etre modifier dans drawing component
    public canvasSize: Vec2 ={x:0,y:0};
    setSizeCanva(dimensionPage:Vec2):void{
       
        if(dimensionPage.x/2<250){
            this.canvasSize.x=250;

        }
        if(dimensionPage.y/2<250){
            this.canvasSize.y=250;

        }
        
    }
}
