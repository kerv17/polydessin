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
    moved: boolean = false;
    bottomRight: boolean = false;

    bottomRightHandler: Vec2;
    topLeftHandler: Vec2;
    initialMousePosition: Vec2;
    initialSelectionPosition: Vec2;

    constructor(drawingService: DrawingService, private selectionHandler: SelectionHandlerService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
        this.rectangleService = new RectangleService(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === Globals.MouseButton.Left;
        const mousePosition = this.getPositionFromMouse(event);
        // si sélection active
        if (this.inSelection) {
            if (this.onMouseDownHandler(event, mousePosition)) {
                // verif si un des 8 handlers a été cliqué
            } else if (this.onMouseDownSelection(event, mousePosition)) {
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
            const mousePosition = this.getPositionFromMouse(event);
            const vec: Vec2[] = this.rectangleService.getRectanglePoints(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            if (this.inMovement) {
                this.updateCanvasOnMove();
                this.onMouseMoveSelection(event, this.drawingService.previewCtx);
            } else {
                this.bottomRightHandler = vec[2];
                if (this.inSelection) {
                    this.onMouseMoveHandler(this.drawingService.previewCtx, vec, mousePosition);
                } else {
                    this.drawBorder(this.drawingService.previewCtx, vec);
                }
                this.selectArea(this.drawingService.baseCtx, vec);
            }
            this.clearPath();
            this.pathData.push(vec[0]);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            if (this.inMovement) {
                this.onMouseUpSelection(event);
                this.inMovement = false;
                this.drawSelectionBox(this.drawingService.previewCtx);
            } else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                if (this.inSelection) {
                    this.onMouseUpHandler();
                }
                this.drawSelectionBox(this.drawingService.previewCtx);
                this.initialSelectionPosition = this.topLeftHandler;
                this.inSelection = true;
            }
        }
        this.mouseDown = false;
        this.clearPath();
    }

    updateCanvasOnMove(): void {
        this.drawingService.previewCtx.fillStyle = 'white';
        this.drawingService.previewCtx.strokeStyle = 'white';
        this.drawingService.previewCtx.fillRect(
            this.initialSelectionPosition.x,
            this.initialSelectionPosition.y,
            this.selectedArea.width,
            this.selectedArea.height,
        );
        this.drawingService.previewCtx.stroke();
        this.drawingService.previewCtx.fillStyle = 'black';
        this.drawingService.previewCtx.strokeStyle = 'black';
    }

    onShift(shifted: boolean): void {
        this.rectangleService.shift = shifted;
        this.onMouseMove(this.rectangleService.lastMoveEvent);
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

    onEscape(): void {
        this.inSelection = false;
        this.bottomRight = false;
        this.mouseDown = false;
        this.inMovement = false;
        this.topLeftHandler = { x: 0, y: 0 };
        this.bottomRightHandler = { x: 0, y: 0 };
        this.initialSelectionPosition = { x: 0, y: 0 };
        this.initialMousePosition = { x: 0, y: 0 };
        this.clearPath();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
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
    }

    // cadre avec les 8 pts de selection
    private drawSelectionBox(ctx: CanvasRenderingContext2D): void {
        this.selectionHandler.setHandlersPositions(this.topLeftHandler, this.bottomRightHandler);
        this.drawHandles(ctx);
        ctx.lineWidth = this.width;
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

    // mousedown on handler
    // doit trouver quel handler a été cliqué
    onMouseDownHandler(event: MouseEvent, mousePosition: Vec2): boolean {
        if (
            mousePosition.x >= this.bottomRightHandler.x - 5 &&
            mousePosition.x <= this.bottomRightHandler.x + 5 &&
            mousePosition.y <= this.bottomRightHandler.y + 5 &&
            mousePosition.y >= this.bottomRightHandler.y - 5
        ) {
            this.bottomRight = true;
            return true;
        } else {
            return false;
        }
    }

    // mousemove on handler
    // doit ajuster la grandeur de la sélection en fonction du drag
    onMouseMoveHandler(ctx: CanvasRenderingContext2D, path: Vec2[], mousePosition: Vec2): void {
        if (this.bottomRight) {
            const width: number = mousePosition.x - this.topLeftHandler.x;
            const height: number = mousePosition.y - this.topLeftHandler.y;
            this.selectedArea = ctx.getImageData(this.topLeftHandler.x, this.topLeftHandler.y, width, height);
            this.bottomRightHandler = mousePosition;
            this.drawSelectionBox(ctx);
        }
    }

    // mouseup on handler
    onMouseUpHandler(): void {
        this.bottomRight = false;
    }

    // mouseoverhandler pour curseur souris resize

    // mouse down
    // vérif si cliqué à l'intérieur des limites de la sélection
    // récupère coordonné cliqué
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

    // mouse move
    // si mouse Down true, déplace coin sup gauche de la distance dont la coordonnée cliqué à été déplacé
    // clear le prev ctx et put image data sur prevctx à chaque mouvement
    onMouseMoveSelection(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
        const deplacement: Vec2 = { x: event.x - this.initialMousePosition.x, y: event.y - this.initialMousePosition.y };
        const position: Vec2 = { x: this.topLeftHandler.x + deplacement.x, y: this.topLeftHandler.y + deplacement.y };
        ctx.putImageData(this.selectedArea, position.x, position.y);
    }

    // mouse up
    // confirme le déplacement de la sélection
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
    // event listeners sur les flèches
}
