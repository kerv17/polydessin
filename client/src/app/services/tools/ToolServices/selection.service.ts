import { Injectable } from '@angular/core';
import { Setting, Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionMovementService } from '@app/services/SelectionMovement/selection-movement.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';
import { RectangleService } from './rectangle-service';
@Injectable({
    providedIn: 'root',
})
export class SelectionService extends Tool {
    rectangleService: RectangleService;
    inSelection: boolean = false;
    private inMovement: boolean = false;
    private selectedArea: ImageData;

    constructor(drawingService: DrawingService, private selectionMove: SelectionMovementService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
        this.rectangleService = new RectangleService(this.drawingService);

        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.selectionMove.onArrowKeyDown(event, this.inSelection, this.pathData, this.pathData[Globals.CURRENT_SELECTION_POSITION]);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.updateCanvasOnMove(this.drawingService.previewCtx);
            this.drawingService.previewCtx.putImageData(
                this.selectedArea,
                this.pathData[Globals.CURRENT_SELECTION_POSITION].x,
                this.pathData[Globals.CURRENT_SELECTION_POSITION].y,
            );
        });

        document.addEventListener('keyup', (event: KeyboardEvent) => {
            this.selectionMove.onArrowKeyUp(event, this.inSelection);
        });
    }

    getActualPosition(): Vec2 {
        if (this.pathData.length !== 0) {
            return { x: this.pathData[Globals.CURRENT_SELECTION_POSITION].x, y: this.pathData[Globals.CURRENT_SELECTION_POSITION].y };
        }
        return { x: 0, y: 0 };
    }

    getSelectionWidth(): number {
        if (this.selectedArea !== undefined) {
            return this.selectedArea.width;
        }
        return 0;
    }

    getSelectionHeight(): number {
        if (this.selectedArea !== undefined) {
            return this.selectedArea.height;
        }
        return 0;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === Globals.MouseButton.Left;

        if (this.inSelection) {
            const mousePosition = this.getPositionFromMouse(event);
            if (
                this.selectionMove.onMouseDown(
                    event,
                    mousePosition,
                    this.pathData[Globals.CURRENT_SELECTION_POSITION],
                    this.selectedArea.width,
                    this.selectedArea.height,
                )
            ) {
                this.inMovement = true;
                this.inSelection = false;
            } else {
                this.onEscape();
            }
        } else {
            this.rectangleService.onMouseDown(event);
            this.pathData.push(this.rectangleService.getPath()[0]);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.rectangleService.lastMoveEvent = event;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            if (this.inMovement) {
                this.updateCanvasOnMove(this.drawingService.previewCtx);
                this.selectionMove.onMouseMove(
                    event,
                    this.drawingService.previewCtx,
                    this.pathData[Globals.CURRENT_SELECTION_POSITION],
                    this.selectedArea,
                );
            } else {
                this.pathData = this.rectangleService.getRectanglePoints(this.getPositionFromMouse(event));
                this.drawBorder(this.drawingService.previewCtx);
                this.selectArea(this.drawingService.baseCtx);
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            if (this.inMovement) {
                this.selectionMove.onMouseUp(event, this.pathData[Globals.CURRENT_SELECTION_POSITION], this.pathData);
                this.inMovement = false;
                this.inSelection = true;
            } else if (this.pathData[0].x !== mousePosition.x && this.pathData[0].y !== mousePosition.y) {
                this.setTopLeftHandler();
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.inSelection = true;
            }
        }
        this.mouseDown = false;
    }

    onShift(shifted: boolean): void {
        this.rectangleService.shift = shifted;
        this.onMouseMove(this.rectangleService.lastMoveEvent);
    }

    onEscape(): void {
        if (this.inSelection) {
            this.confirmSelectionMove();
            this.dispatchAction(this.createAction());
            this.inSelection = false;
            this.mouseDown = false;
            this.inMovement = false;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clearPath();
            this.selectedArea = this.drawingService.baseCtx.getImageData(0, 0, 1, 1);
        }
    }

    // selectionner tout le canvas avec Ctrl + A
    selectCanvas(width: number, height: number): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selectedArea = this.drawingService.baseCtx.getImageData(0, 0, width, height);
        this.inSelection = true;
        this.pathData.push({ x: 0, y: 0 });
        this.rectangleService.setPath(this.pathData);
        this.pathData = this.rectangleService.getRectanglePoints({ x: width, y: height });
        this.pathData.push({ x: 0, y: 0 });
    }

    // undoredo
    doAction(action: DrawAction): void {
        const previousSetting: Setting = this.saveSetting();
        this.loadSetting(action.setting);
        this.selectArea(this.drawingService.baseCtx);
        this.confirmSelectionMove();
        this.loadSetting(previousSetting);
    }

    // selection des pixels
    private selectArea(ctx: CanvasRenderingContext2D): void {
        const width: number = this.pathData[2].x - this.pathData[0].x;
        const height: number = this.pathData[2].y - this.pathData[0].y;
        this.selectedArea = ctx.getImageData(this.pathData[0].x, this.pathData[0].y, width, height);
    }

    private updateCanvasOnMove(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.fillRect(this.pathData[0].x, this.pathData[0].y, this.selectedArea.width, this.selectedArea.height);
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
    }

    private confirmSelectionMove(): void {
        this.updateCanvasOnMove(this.drawingService.baseCtx);
        this.drawingService.baseCtx.putImageData(
            this.selectedArea,
            this.pathData[Globals.CURRENT_SELECTION_POSITION].x,
            this.pathData[Globals.CURRENT_SELECTION_POSITION].y,
        );
    }

    private drawBorder(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const point of this.pathData) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.setLineDash([Globals.LINE_DASH, Globals.LINE_DASH]);
        for (const point of this.pathData) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Ajuste le pathData pour permettre la selection à partir de n'importe quel coin
    // donc pour tracer le rectangle de selection dans n'importe quelle direction
    private setTopLeftHandler(): void {
        const firstCorner = { x: this.pathData[0].x, y: this.pathData[0].y };
        const oppositeCorner = { x: this.pathData[2].x, y: this.pathData[2].y };

        if (firstCorner.x < oppositeCorner.x && firstCorner.y > oppositeCorner.y) {
            this.clearPath();
            this.pathData.push({ x: firstCorner.x, y: oppositeCorner.y });
            this.rectangleService.setPath(this.pathData);
            this.pathData = this.rectangleService.getRectanglePoints({ x: oppositeCorner.x, y: firstCorner.y });
        } else if (firstCorner.x > oppositeCorner.x && firstCorner.y > oppositeCorner.y) {
            this.clearPath();
            this.pathData.push({ x: oppositeCorner.x, y: oppositeCorner.y });
            this.rectangleService.setPath(this.pathData);
            this.pathData = this.rectangleService.getRectanglePoints({ x: firstCorner.x, y: firstCorner.y });
        } else if (firstCorner.x > oppositeCorner.x && firstCorner.y < oppositeCorner.y) {
            this.clearPath();
            this.pathData.push({ x: oppositeCorner.x, y: firstCorner.y });
            this.rectangleService.setPath(this.pathData);
            this.pathData = this.rectangleService.getRectanglePoints({ x: firstCorner.x, y: oppositeCorner.y });
        }
        this.pathData.push({ x: this.pathData[0].x, y: this.pathData[0].y });
    }
}
