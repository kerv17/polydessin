import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';

// TODO : Déplacer ça dans un fichier séparé accessible par tous
@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    color: string;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === Globals.MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.outOfBounds) {
            this.mouseDown = false;
            this.clearPath();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }

        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            if (this.pathData[0].x - this.pathData[1].x === 0 && this.pathData[0].y - this.pathData[1].y === 0) {
                this.drawPixel(this.drawingService.baseCtx, this.pathData);
            }

            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawLine(this.drawingService.baseCtx, this.pathData);
            this.clearPath();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.outOfBounds = true;
        }
    }

    onMouseEnter(event: MouseEvent): void {
        this.outOfBounds = false;
    }

    private drawPixel(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.applyAttributes(ctx);
        if (ctx.lineWidth === 1) {
            ctx.fillStyle = this.color;
            ctx.fillRect(path[path.length - 1].x, path[path.length - 1].y, 1, 1);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.applyAttributes(ctx);

        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        let action: DrawAction = {
          tool: this as Tool,
          colors:[this.color],
          widths:[this.width],
          points: path
         } as DrawAction;
        if( ctx === this.drawingService.baseCtx){
            let c:CustomEvent = new CustomEvent('action',{detail: action});
            dispatchEvent(c);
         }
    }

    // fonction ayant pour but de valider les valeurs de couleur et de largeur avant de les appliquer
    applyAttributes(ctx: CanvasRenderingContext2D): void {
        ctx.lineCap = 'round';
        const width = this.width;

        if (width !== undefined && width > 0) {
            ctx.lineWidth = width;
        }

        if (this.color !== undefined && this.color !== '') {
            ctx.strokeStyle = this.color;
        }
    }

    doAction(action:DrawAction): void{
      const baseCtx = this.drawingService.baseCtx;
      baseCtx.lineCap = 'round';
      const width = action.widths[0];

      if (width !== undefined && width > 0) {
          baseCtx.lineWidth = width;
      }

      if (action.colors[0] !== undefined && action.colors[0] !== '') {
          baseCtx.strokeStyle = action.colors[0];
      }

      baseCtx.beginPath();
        for (const point of action.points) {
          baseCtx.lineTo(point.x, point.y);
        }
        baseCtx.stroke();
    }


}
