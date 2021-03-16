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
    selectedArea: ImageData;

    inSelection: boolean = false;
    private inMovement: boolean = false;

    topLeftHandler: Vec2;
    initialSelectionPosition: Vec2;

    constructor(drawingService: DrawingService, private selectionMove: SelectionMovementService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
        this.rectangleService = new RectangleService(this.drawingService);

        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.selectionMove.onArrowKeyDown(event, this.inSelection);
            this.topLeftHandler = this.selectionMove.moveSelection(this.topLeftHandler);
            if (this.pathData.length > 4) {
                this.pathData.pop();
            }
            this.pathData.push(this.topLeftHandler);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.updateCanvasOnMove(this.drawingService.previewCtx);
            this.drawingService.previewCtx.putImageData(this.selectedArea, this.topLeftHandler.x, this.topLeftHandler.y);
        });

        document.addEventListener('keyup', (event: KeyboardEvent) => {
            this.selectionMove.onArrowKeyUp(event, this.inSelection);
        });
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === Globals.MouseButton.Left;
        const mousePosition = this.getPositionFromMouse(event);
        if (this.inSelection) {
            if (this.selectionMove.onMouseDown(event, mousePosition, this.topLeftHandler, this.selectedArea.width, this.selectedArea.height)) {
                this.inMovement = true;
                this.inSelection = false;
            } else {
                if (this.pathData.length > 4) {
                    this.pathData.pop();
                }
                this.pathData.push(this.topLeftHandler);
                this.onEscape();
            }
        } else {
            this.rectangleService.onMouseDown(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.rectangleService.lastMoveEvent = event;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            if (this.inMovement) {
                this.updateCanvasOnMove(this.drawingService.previewCtx);
                this.selectionMove.onMouseMove(event, this.drawingService.previewCtx, this.topLeftHandler, this.selectedArea);
            } else {
                this.pathData = this.rectangleService.getRectanglePoints(this.getPositionFromMouse(event));
                this.setTopLeftHandler();
                this.drawBorder(this.drawingService.previewCtx);
                this.selectArea(this.drawingService.baseCtx);
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            if (this.inMovement) {
                this.topLeftHandler = this.selectionMove.onMouseUp(event, this.topLeftHandler, this.pathData);
                this.inMovement = false;
                this.inSelection = true;
            } else if (this.pathData[0].x !== mousePosition.x && this.pathData[0].y !== mousePosition.x) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.initialSelectionPosition = { x: this.topLeftHandler.x, y: this.topLeftHandler.y };
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
            this.topLeftHandler = { x: 0, y: 0 };
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clearPath();
            this.selectedArea = this.drawingService.baseCtx.getImageData(0, 0, 1, 1);
        }
    }

    // selectionner tout le canvas avec Ctrl + A
    selectCanvas(width: number, height: number): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.topLeftHandler = { x: 0, y: 0 };
        this.selectedArea = this.drawingService.baseCtx.getImageData(0, 0, width, height);
        this.inSelection = true;
        this.initialSelectionPosition = { x: this.topLeftHandler.x, y: this.topLeftHandler.y };
        this.pathData.push(this.topLeftHandler);
        this.rectangleService.setPath(this.pathData);
        this.pathData = this.rectangleService.getRectanglePoints({ x: width, y: height });
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
        ctx.fillRect(this.initialSelectionPosition.x, this.initialSelectionPosition.y, this.selectedArea.width, this.selectedArea.height);
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
    }

    private confirmSelectionMove(): void {
        this.updateCanvasOnMove(this.drawingService.baseCtx);
        this.drawingService.baseCtx.putImageData(this.selectedArea, this.pathData[4].x, this.pathData[4].y);
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

    private setTopLeftHandler(): void {
        if (this.pathData[0].x < this.pathData[2].x && this.pathData[0].y < this.pathData[2].y) {
            this.topLeftHandler = { x: this.pathData[0].x, y: this.pathData[0].y };
        } else if (this.pathData[0].x < this.pathData[2].x && this.pathData[0].y > this.pathData[2].y) {
            this.topLeftHandler = { x: this.pathData[0].x, y: this.pathData[2].y };
        } else if (this.pathData[0].x > this.pathData[2].x && this.pathData[0].y > this.pathData[2].y) {
            this.topLeftHandler = { x: this.pathData[2].x, y: this.pathData[2].y };
        } else if (this.pathData[0].x > this.pathData[2].x && this.pathData[0].y < this.pathData[2].y) {
            this.topLeftHandler = { x: this.pathData[2].x, y: this.pathData[0].y };
        }
    }

    doAction(action: DrawAction): void {
        const previousSetting: Setting = this.saveSetting();
        this.loadSetting(action.setting);
        this.selectArea(this.drawingService.baseCtx);
        this.confirmSelectionMove();
        this.loadSetting(previousSetting);
    }
}
