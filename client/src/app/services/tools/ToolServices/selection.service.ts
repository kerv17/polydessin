import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionHandlerService } from '@app/services/selectionHandler/selection-handler.service';
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

    leftArrow: boolean = false;
    downArrow: boolean = false;
    rightArrow: boolean = false;
    upArrow: boolean = false;

    constructor(drawingService: DrawingService, private selectionHandler: SelectionHandlerService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
        this.rectangleService = new RectangleService(drawingService);

        this.inSelection = false;
        this.mouseDown = false;
        this.inMovement = false;

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
        // si sélection active
        if (this.inSelection) {
            if (this.onMouseDownSelection(event, mousePosition)) {
                // verif si cliqué sur la sélection
            } else {
                this.onEscape();
            }
        } else {
            // pas de sélection active
            this.topLeftHandler = mousePosition;
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
                this.bottomRightHandler = vec[2];
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
                this.drawSelectionBox(this.drawingService.previewCtx);
            } else if (this.topLeftHandler.x !== mousePosition.x && this.topLeftHandler.y !== mousePosition.x) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSelectionBox(this.drawingService.previewCtx);
                this.initialSelectionPosition = { x: this.topLeftHandler.x, y: this.topLeftHandler.y };
                this.inSelection = true;
            }
        }
        this.mouseDown = false;
        this.clearPath();
    }

    updateCanvasOnMove(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.fillRect(this.initialSelectionPosition.x, this.initialSelectionPosition.y, this.selectedArea.width, this.selectedArea.height);
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
    }

    confirmSelectionMove(): void {
        this.updateCanvasOnMove(this.drawingService.baseCtx);
        this.drawingService.baseCtx.putImageData(this.selectedArea, this.topLeftHandler.x, this.topLeftHandler.y);
    }

    onShift(shifted: boolean): void {
        this.rectangleService.shift = shifted;
        this.onMouseMove(this.rectangleService.lastMoveEvent);
    }

    private drawBorder(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
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

    onEscape(): void {
        if (this.inSelection) {
            this.confirmSelectionMove();
            this.inSelection = false;
            this.mouseDown = false;
            this.inMovement = false;
            this.topLeftHandler = { x: 0, y: 0 };
            this.bottomRightHandler = { x: 0, y: 0 };
            this.initialSelectionPosition = { x: 0, y: 0 };
            this.initialMousePosition = { x: 0, y: 0 };
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.selectedArea = this.drawingService.baseCtx.getImageData(0, 0, 1, 1);
        }
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
        this.drawSelectionBox(this.drawingService.previewCtx);
        this.selectedArea = this.drawingService.baseCtx.getImageData(0, 0, width, height);
        this.inSelection = true;
        this.initialSelectionPosition = { x: this.topLeftHandler.x, y: this.topLeftHandler.y };
    }

    // cadre avec les 8 pts de selection
    private drawSelectionBox(ctx: CanvasRenderingContext2D): void {
        this.selectionHandler.setHandlersPositions(this.topLeftHandler, this.bottomRightHandler);
        this.drawHandles(ctx);
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        for (const point of this.selectionHandler.handlersPositions) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = 'black';
    }

    // 8pts de contrôle
    private drawHandles(ctx: CanvasRenderingContext2D): void {
        // 4 coins
        ctx.fillRect(this.selectionHandler.handlersPositions[0].x - 5, this.selectionHandler.handlersPositions[0].y - 5, 10, 10); // coin haut gauche
        ctx.fillRect(this.selectionHandler.handlersPositions[1].x - 5, this.selectionHandler.handlersPositions[1].y - 5, 10, 10); // coin bas gauche
        ctx.fillRect(this.selectionHandler.handlersPositions[2].x - 5, this.selectionHandler.handlersPositions[2].y - 5, 10, 10); // coin bas droit
        ctx.fillRect(this.selectionHandler.handlersPositions[3].x - 5, this.selectionHandler.handlersPositions[3].y - 5, 10, 10); // coin haut gauche

        // 4 pts centraux
        ctx.fillRect(this.selectionHandler.handlersPositions[4].x - 5, this.selectionHandler.handlersPositions[4].y - 5, 10, 10); // coin haut gauche
        ctx.fillRect(this.selectionHandler.handlersPositions[5].x - 5, this.selectionHandler.handlersPositions[5].y - 5, 10, 10); // coin bas gauche
        ctx.fillRect(this.selectionHandler.handlersPositions[6].x - 5, this.selectionHandler.handlersPositions[6].y - 5, 10, 10); // coin bas droit
        ctx.fillRect(this.selectionHandler.handlersPositions[7].x - 5, this.selectionHandler.handlersPositions[7].y - 5, 10, 10); // coin haut gauche
    }

    // mouseoverhandler pour curseur souris resize

    onMouseDownSelection(event: MouseEvent, mousePosition: Vec2): boolean {
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

    onMouseMoveSelection(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
        const deplacement: Vec2 = { x: event.x - this.initialMousePosition.x, y: event.y - this.initialMousePosition.y };
        const position: Vec2 = { x: this.topLeftHandler.x + deplacement.x, y: this.topLeftHandler.y + deplacement.y };
        ctx.putImageData(this.selectedArea, position.x, position.y);
    }

    onMouseUpSelection(event: MouseEvent): void {
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

    // déplacement avec clavier (flèches)
    checkArrowKeyDown(event: KeyboardEvent): void {
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

    onMoveArrows(): void {
        // 500 ms avant le déplacement
        // tant que c'est appuyé 3 pixels à chaque 100ms
        // delay(500);
        if (this.leftArrow || this.upArrow || this.rightArrow || this.downArrow) {
            this.positionArrows();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.updateCanvasOnMove(this.drawingService.previewCtx);
            this.drawingService.previewCtx.putImageData(this.selectedArea, this.topLeftHandler.x, this.topLeftHandler.y);
        }
        // delay(100);
    }

    positionArrows(): void {
        // 3 pixels par déplacement
        if (this.leftArrow) {
            this.topLeftHandler.x -= 3;
            this.bottomRightHandler.x -= 3;
        }
        if (this.upArrow) {
            this.topLeftHandler.y -= 3;
            this.bottomRightHandler.y -= 3;
        }
        if (this.rightArrow) {
            this.topLeftHandler.x += 3;
            this.bottomRightHandler.x += 3;
        }
        if (this.downArrow) {
            this.topLeftHandler.y += 3;
            this.bottomRightHandler.y += 3;
        }
    }

    checkArrowKeyUp(event: KeyboardEvent): void {
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

            if (!this.leftArrow && !this.upArrow && !this.rightArrow && !this.downArrow) {
                this.drawSelectionBox(this.drawingService.previewCtx);
            }
        }
    }
}
