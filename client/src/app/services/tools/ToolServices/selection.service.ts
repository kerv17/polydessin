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
    selectedArea: ImageData;

    inSelection: boolean = false;
    inMovement: boolean = false;

    bottomRightHandler: Vec2;
    topLeftHandler: Vec2;
    initialMousePosition: Vec2;
    initialSelectionPosition: Vec2;
    firstCorner: Vec2;
    oppositeCorner: Vec2;
    handlersPositions: Vec2[] = [];

    leftArrow: boolean = false;
    downArrow: boolean = false;
    rightArrow: boolean = false;
    upArrow: boolean = false;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
        this.rectangleService = new RectangleService(this.drawingService);

        this.onEscape();

        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.checkArrowKeyDown(event);
            this.onMoveArrows();
        });
        document.addEventListener('keyup', (event: KeyboardEvent) => {
            this.checkArrowKeyUp(event);
        });
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === Globals.MouseButton.Left;
        const mousePosition = this.getPositionFromMouse(event);
        if (this.inSelection) {
            if (!this.onMouseDownSelection(event, mousePosition)) {
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
                this.onMouseMoveSelection(event, this.drawingService.previewCtx);
            } else {
                const mousePosition = this.getPositionFromMouse(event);
                const vec: Vec2[] = this.rectangleService.getRectanglePoints(mousePosition);
                this.oppositeCorner = vec[2];
                this.setTopLeftHandler();
                this.drawBorder(this.drawingService.previewCtx, vec);
                this.selectArea(this.drawingService.baseCtx, vec);
            }
            this.clearPath();
            this.pathData.push(this.topLeftHandler);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            if (this.inMovement) {
                this.onMouseUpSelection(event);
                this.inMovement = false;
            } else if (this.firstCorner.x !== mousePosition.x && this.firstCorner.y !== mousePosition.x) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.initialSelectionPosition = { x: this.topLeftHandler.x, y: this.topLeftHandler.y };
                this.inSelection = true;
            }
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onShift(shifted: boolean): void {
        this.rectangleService.shift = shifted;
        this.onMouseMove(this.rectangleService.lastMoveEvent);
    }

    onEscape(): void {
        if (this.inSelection) {
            this.confirmSelectionMove();
            this.inSelection = false;
            this.mouseDown = false;
            this.inMovement = false;
            this.firstCorner = { x: 0, y: 0 };
            this.oppositeCorner = { x: 0, y: 0 };
            this.topLeftHandler = { x: 0, y: 0 };
            this.bottomRightHandler = { x: 0, y: 0 };
            this.initialSelectionPosition = { x: 0, y: 0 };
            this.initialMousePosition = { x: 0, y: 0 };
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clearPath();
            this.selectedArea = this.drawingService.baseCtx.getImageData(0, 0, 1, 1);
            this.handlersPositions = [];
        }
    }

    private setTopLeftHandler(): void {
        if (this.firstCorner.x < this.oppositeCorner.x && this.firstCorner.y < this.oppositeCorner.y) {
            this.topLeftHandler = { x: this.firstCorner.x, y: this.firstCorner.y };
            this.bottomRightHandler = { x: this.oppositeCorner.x, y: this.oppositeCorner.y };
        } else if (this.firstCorner.x < this.oppositeCorner.x && this.firstCorner.y > this.oppositeCorner.y) {
            this.topLeftHandler = { x: this.firstCorner.x, y: this.oppositeCorner.y };
            this.bottomRightHandler = { x: this.oppositeCorner.x, y: this.firstCorner.y };
        } else if (this.firstCorner.x > this.oppositeCorner.x && this.firstCorner.y > this.oppositeCorner.y) {
            this.topLeftHandler = { x: this.oppositeCorner.x, y: this.oppositeCorner.y };
            this.bottomRightHandler = { x: this.firstCorner.x, y: this.firstCorner.y };
        } else if (this.firstCorner.x > this.oppositeCorner.x && this.firstCorner.y < this.oppositeCorner.y) {
            this.topLeftHandler = { x: this.oppositeCorner.x, y: this.firstCorner.y };
            this.bottomRightHandler = { x: this.firstCorner.x, y: this.oppositeCorner.y };
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
    }

    private drawBorder(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.setLineDash([Globals.LINE_DASH, Globals.LINE_DASH]);
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // selection des pixels
    private selectArea(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const width: number = path[2].x - path[0].x;
        const height: number = path[2].y - path[0].y;
        this.selectedArea = ctx.getImageData(path[0].x, path[0].y, width, height);
    }

    // selectionner tout le canvas avec Ctrl + A
    selectCanvas(width: number, height: number): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.topLeftHandler = { x: 0, y: 0 };
        this.bottomRightHandler = { x: width, y: height };
        this.selectedArea = this.drawingService.baseCtx.getImageData(0, 0, width, height);
        this.inSelection = true;
        this.initialSelectionPosition = { x: this.topLeftHandler.x, y: this.topLeftHandler.y };
    }

    private onMouseDownSelection(event: MouseEvent, mousePosition: Vec2): boolean {
        if (
            mousePosition.x > this.topLeftHandler.x &&
            mousePosition.x < this.bottomRightHandler.x &&
            mousePosition.y > this.topLeftHandler.y &&
            mousePosition.y < this.bottomRightHandler.y
        ) {
            this.initialMousePosition = { x: event.x, y: event.y };
            this.inMovement = true;
            this.inSelection = false;
            return true;
        } else {
            return false;
        }
    }

    private onMouseMoveSelection(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
        const deplacement: Vec2 = { x: event.x - this.initialMousePosition.x, y: event.y - this.initialMousePosition.y };
        const position: Vec2 = { x: this.topLeftHandler.x + deplacement.x, y: this.topLeftHandler.y + deplacement.y };
        ctx.putImageData(this.selectedArea, position.x, position.y);
    }

    private onMouseUpSelection(event: MouseEvent): void {
        if (this.inMovement) {
            const deplacement: Vec2 = { x: event.x - this.initialMousePosition.x, y: event.y - this.initialMousePosition.y };
            const position: Vec2 = { x: this.topLeftHandler.x + deplacement.x, y: this.topLeftHandler.y + deplacement.y };
            this.topLeftHandler = position;
            this.bottomRightHandler = { x: this.topLeftHandler.x + this.selectedArea.width, y: this.topLeftHandler.y + this.selectedArea.height };
            this.inMovement = false;
            this.initialMousePosition = { x: 0, y: 0 };
            this.inSelection = true;
        }
    }

    private checkArrowKeyDown(event: KeyboardEvent): void {
        if (this.inSelection) {
            if (event.key === 'ArrowLeft') {
                this.leftArrow = true;
            }
            if (event.key === 'ArrowUp') {
                this.upArrow = true;
            }
            if (event.key === 'ArrowRight') {
                this.rightArrow = true;
            }
            if (event.key === 'ArrowDown') {
                this.downArrow = true;
            }
        }
    }

    private onMoveArrows(): void {
        if (this.leftArrow || this.upArrow || this.rightArrow || this.downArrow) {
            this.positionArrows();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.updateCanvasOnMove(this.drawingService.previewCtx);
            this.drawingService.previewCtx.putImageData(this.selectedArea, this.topLeftHandler.x, this.topLeftHandler.y);
        }
    }

    private positionArrows(): void {
        if (this.leftArrow) {
            this.topLeftHandler.x -= Globals.N_PIXELS_DEPLACEMENT;
            this.bottomRightHandler.x -= Globals.N_PIXELS_DEPLACEMENT;
        }
        if (this.upArrow) {
            this.topLeftHandler.y -= Globals.N_PIXELS_DEPLACEMENT;
            this.bottomRightHandler.y -= Globals.N_PIXELS_DEPLACEMENT;
        }
        if (this.rightArrow) {
            this.topLeftHandler.x += Globals.N_PIXELS_DEPLACEMENT;
            this.bottomRightHandler.x += Globals.N_PIXELS_DEPLACEMENT;
        }
        if (this.downArrow) {
            this.topLeftHandler.y += Globals.N_PIXELS_DEPLACEMENT;
            this.bottomRightHandler.y += Globals.N_PIXELS_DEPLACEMENT;
        }
    }

    private checkArrowKeyUp(event: KeyboardEvent): void {
        if (this.inSelection) {
            if (event.key === 'ArrowLeft') {
                this.leftArrow = false;
            }
            if (event.key === 'ArrowUp') {
                this.upArrow = false;
            }
            if (event.key === 'ArrowRight') {
                this.rightArrow = false;
            }
            if (event.key === 'ArrowDown') {
                this.downArrow = false;
            }
        }
    }

    // calcul position des 8 handlers
    setHandlersPositions(topLeft: Vec2, bottomRight: Vec2): void {
        this.handlersPositions = [];
        // coin haut gauche
        this.handlersPositions.push(topLeft);
        // centre haut
        this.handlersPositions.push({ x: bottomRight.x - (bottomRight.x - topLeft.x) / 2, y: topLeft.y });
        // coin haut droite
        this.handlersPositions.push({ x: bottomRight.x, y: topLeft.y });
        // centre droite
        this.handlersPositions.push({ x: bottomRight.x, y: bottomRight.y - (bottomRight.y - topLeft.y) / 2 });
        // coin bas droite
        this.handlersPositions.push(bottomRight);
        // centre bas
        this.handlersPositions.push({ x: bottomRight.x - (bottomRight.x - topLeft.x) / 2, y: bottomRight.y });
        // coin bas gauche
        this.handlersPositions.push({ x: topLeft.x, y: bottomRight.y });
        // centre gauche
        this.handlersPositions.push({ x: topLeft.x, y: bottomRight.y - (bottomRight.y - topLeft.y) / 2 });
    }
}
