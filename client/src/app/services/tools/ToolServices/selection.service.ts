import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from './rectangle-service';

@Injectable({
    providedIn: 'root',
})
export class SelectionService extends Tool {
    rectangleService: RectangleService;
    lastMoveEvent: MouseEvent;
    selectedArea: ImageData;
    inSelection: boolean = false;
    bottomLeftCornerHandler: Vec2;
    leftHandler: boolean = false;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
        this.rectangleService = new RectangleService(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === Globals.MouseButton.Left;
        if (this.inSelection) {
            this.onMouseDownHandler(event);
        } else {
            this.rectangleService.onMouseDown(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            const vec: Vec2[] = this.rectangleService.getRectanglePoints(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.inSelection) {
                this.onMouseUpHandler();
            }
            this.drawSelectionBox(this.drawingService.previewCtx, vec);
            this.drawArea(this.drawingService.previewCtx, this.selectedArea);
        }
        this.mouseDown = false;
        this.clearPath();
        this.inSelection = true;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastMoveEvent = event;
            const mousePosition = this.getPositionFromMouse(event);
            const vec: Vec2[] = this.rectangleService.getRectanglePoints(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            if (this.inSelection) {
                this.onMouseMoveHandler(event, this.drawingService.previewCtx, vec);
            } else {
                this.drawBorder(this.drawingService.previewCtx, vec);
            }
            this.selectArea(this.drawingService.baseCtx, vec);
            this.drawArea(this.drawingService.previewCtx, this.selectedArea);
            this.clearPath();
            this.pathData.push(vec[0]);
        }
    }

    onShift(shifted: boolean): void {
        this.rectangleService.shift = shifted;
        this.onMouseMove(this.lastMoveEvent);
    }

    private drawBorder(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.width;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.setLineDash([10, 10]);
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([0, 0]);
    }

    // on escape
    onEscape(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selectedArea = new ImageData(0, 0);
        this.clearPath();
        this.inSelection = false;
        this.leftHandler = false;
    }

    // selection des pixels
    private selectArea(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const width: number = path[2].x - path[0].x;
        const height: number = path[2].y - path[0].y;
        this.selectedArea = ctx.getImageData(path[0].x, path[0].y, width, height);
    }

    // test
    drawArea(ctx: CanvasRenderingContext2D, selection: ImageData): void {
        ctx.putImageData(selection, 100, 100);
    }

    // selectionner tout le canvas avec Ctrl + A
    selectCanvas(basectx: CanvasRenderingContext2D, prevctx: CanvasRenderingContext2D, width: number, height: number): void {
        prevctx.fillRect(0, 0, 10, 10); // coin haut gauche
        prevctx.fillRect(0, height - 10, 10, 10); // coin bas gauche
        prevctx.fillRect(width - 10, height - 10, 10, 10); // coin bas droit
        prevctx.fillRect(width - 10, 0, 10, 10); // coin haut gauche
        prevctx.fillRect((width - 5) / 2, 0, 10, 10); // centre haut
        prevctx.fillRect(0, (height - 5) / 2, 10, 10); // centre gauche
        prevctx.fillRect(width - 10, (height - 5) / 2, 10, 10); // centre droit
        prevctx.fillRect((width - 5) / 2, height - 10, 10, 10); // centre bas
        this.selectedArea = basectx.getImageData(0, 0, width, height);
    }

    // cadre avec les 8 pts de selection
    private drawSelectionBox(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.width;
        ctx.strokeStyle = 'blue';
        this.drawHandles(ctx, path);
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = 'black';
    }

    // 8pts de contrôle
    private drawHandles(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        // 4 coins
        ctx.fillRect(path[0].x - 5, path[0].y - 5, 10, 10); // coin haut gauche
        ctx.fillRect(path[1].x - 5, path[1].y - 5, 10, 10); // coin bas gauche
        ctx.fillRect(path[2].x - 5, path[2].y - 5, 10, 10); // coin bas droit
        ctx.fillRect(path[3].x - 5, path[3].y - 5, 10, 10); // coin haut gauche

        // 4 pts centraux
        ctx.fillRect(path[3].x - (path[3].x - path[0].x) / 2 - 5, path[0].y - 5, 10, 10); // haut
        ctx.fillRect(path[3].x - 5, path[2].y - (path[2].y - path[3].y) / 2 - 5, 10, 10); // droite
        ctx.fillRect(path[2].x - (path[2].x - path[1].x) / 2 - 5, path[2].y - 5, 10, 10); // bas
        ctx.fillRect(path[1].x - 5, path[1].y - (path[1].y - path[0].y) / 2 - 5, 10, 10); // gauche

        this.bottomLeftCornerHandler = path[2];
    }

    // mousedown on handler
    // doit trouver quel handler a été cliqué
    onMouseDownHandler(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);

        if (mousePosition.x === this.bottomLeftCornerHandler.x && mousePosition.y === this.bottomLeftCornerHandler.y) {
            this.leftHandler = true;
        } else {
            this.inSelection = false;
            this.rectangleService.onMouseDown(event);
        }
    }

    // mousemove on handler
    // doit ajuster la grandeur de la sélection en fonction du drag
    onMouseMoveHandler(event: MouseEvent, ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.leftHandler) {
            const width: number = mousePosition.x - path[0].x;
            const height: number = mousePosition.y - path[0].y;
            this.selectedArea = ctx.getImageData(path[0].x, path[0].y, width, height);
            this.drawSelectionBox(ctx, path);
        }
    }

    // mouseup on handler
    onMouseUpHandler(): void {
        this.leftHandler = false;
    }

    // mouseoverhandler pour curseur souris resize
}
