import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionMovementService } from '@app/services/SelectionMovement/selection-movement.service';
import { RectangleService } from '@app/services/tools/ToolServices/rectangle-service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionService extends Tool {
    rectangleService: RectangleService;
    selectedArea: ImageData;

    inSelection: boolean = false;
    private inMovement: boolean = false;

    private firstCorner: Vec2;
    topLeftHandler: Vec2;
    private initialSelectionPosition: Vec2;

    constructor(drawingService: DrawingService, private selectionMove: SelectionMovementService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
        this.topLeftHandler = { x: 0, y: 0 };
        this.initialSelectionPosition = { x: 0, y: 0 };
        this.selectedArea = { data: new Uint8ClampedArray([0, 0, 0, 0]), width: 1, height: 1 } as ImageData;
        this.rectangleService = new RectangleService(this.drawingService);
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.selectionMove.onArrowKeyDown(event, this.inSelection);
            this.topLeftHandler = this.selectionMove.moveSelection(this.topLeftHandler);
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
                this.onEscape();
            }
        } else {
            this.firstCorner = mousePosition;
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
                this.topLeftHandler = this.selectionMove.onMouseUp(event, this.topLeftHandler);
                this.inMovement = false;
                this.inSelection = true;
            } else if (this.firstCorner.x !== mousePosition.x && this.firstCorner.y !== mousePosition.x) {
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
            this.firstCorner = { x: 0, y: 0 };
            this.topLeftHandler = { x: 0, y: 0 };
            this.initialSelectionPosition = { x: 0, y: 0 };
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
    }

    // selection des pixels
    private selectArea(ctx: CanvasRenderingContext2D): void {
        const width: number = this.pathData[2].x - this.pathData[0].x;
        const height: number = this.pathData[2].y - this.pathData[0].y;
        if (width !== 0 && height !== 0) {
            this.selectedArea = ctx.getImageData(this.pathData[0].x, this.pathData[0].y, width, height);
        }
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
        this.drawingService.baseCtx.putImageData(this.selectedArea, this.topLeftHandler.x, this.topLeftHandler.y);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.pathData.push(this.topLeftHandler);
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
        if (this.firstCorner.x < this.pathData[2].x && this.firstCorner.y < this.pathData[2].y) {
            this.topLeftHandler = { x: this.firstCorner.x, y: this.firstCorner.y };
        } else if (this.firstCorner.x < this.pathData[2].x && this.firstCorner.y > this.pathData[2].y) {
            this.topLeftHandler = { x: this.firstCorner.x, y: this.pathData[2].y };
        } else if (this.firstCorner.x > this.pathData[2].x && this.firstCorner.y > this.pathData[2].y) {
            this.topLeftHandler = { x: this.pathData[2].x, y: this.pathData[2].y };
        } else if (this.firstCorner.x > this.pathData[2].x && this.firstCorner.y < this.pathData[2].y) {
            this.topLeftHandler = { x: this.pathData[2].x, y: this.firstCorner.y };
        }
    }

    doAction(action: DrawAction): void {
        const prevSetting = this.saveSetting();
        const initialSelectionPosition = this.initialSelectionPosition;
        const topLeftHandler = this.topLeftHandler;

        this.loadSetting(action.setting);
        this.selectArea(this.drawingService.baseCtx);
        this.initialSelectionPosition = this.pathData[0];
        // tslint:disable-next-line: no-magic-numbers
        this.topLeftHandler = this.pathData[4];
        this.confirmSelectionMove();

        this.clearPreviewCtx();
        this.loadSetting(prevSetting);
        this.initialSelectionPosition = initialSelectionPosition;
        this.topLeftHandler = topLeftHandler;
        this.selectedArea = this.drawingService.baseCtx.getImageData(0, 0, 1, 1);
    }
}
