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
    lastMoveEvent: MouseEvent;
    selectedArea: ImageData;
    inSelection: boolean = false;
    inMovement: boolean = false;

    bottomRightHandler: Vec2;
    topLeftHandler: Vec2;
    bottomRight: boolean = false;
    initialMousePosition: Vec2;
    initialSelectionPosition: Vec2;

    constructor(drawingService: DrawingService, private selectionHandler: SelectionHandlerService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
        this.rectangleService = new RectangleService(drawingService);
    }
    /*onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === Globals.MouseButton.Left;
        const mousePosition = this.getPositionFromMouse(event);

        if (this.inSelection) {
            if (this.selectionHandler.handlerWasClicked(mousePosition)) {
                this.inSelection = true;
                this.bottomRight = true;
            } else if (this.selectionHandler.movementSelected(mousePosition, this.topLeftHandler, this.bottomRightHandler)) {
                this.inMovement = true;
                this.initialMousePosition = mousePosition;
            } else {
                this.inSelection = false;
                // this.onEscape();
            }
        } else {
            this.topLeftHandler = mousePosition;
            this.rectangleService.onMouseDown(event);
        }
    }*/
    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === Globals.MouseButton.Left;
        const mousePosition = this.getPositionFromMouse(event);
        if (this.inSelection) {
            this.onMouseDownSelection(event, mousePosition);
            if (!this.inMovement) {
                this.topLeftHandler = mousePosition;
                this.onMouseDownHandler(event, mousePosition);
            }
        } else {
            this.topLeftHandler = mousePosition;
            this.rectangleService.onMouseDown(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            if (this.inMovement) {
                this.onMouseUpSelection(event);
                this.drawingService.previewCtx.putImageData(this.selectedArea, this.topLeftHandler.x, this.topLeftHandler.y);
                this.inMovement = false;
                this.drawSelectionBox(this.drawingService.previewCtx);
            } else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                if (this.inSelection) {
                    this.onMouseUpHandler();
                }
                this.drawSelectionBox(this.drawingService.previewCtx);
                this.initialSelectionPosition = this.topLeftHandler;
            }
            this.inSelection = true;
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastMoveEvent = event;
            const mousePosition = this.getPositionFromMouse(event);
            const vec: Vec2[] = this.rectangleService.getRectanglePoints(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.inMovement) {
                /*this.drawingService.previewCtx.fillStyle = 'white';
                this.drawingService.previewCtx.fillRect(
                    this.initialSelectionPosition.x,
                    this.initialSelectionPosition.y,
                    this.selectedArea.width,
                    this.selectedArea.height,
                );
                this.drawingService.previewCtx.stroke();*/
                this.onMouseMoveSelection(event, this.drawingService.previewCtx);
            } else {
                if (this.inSelection) {
                    this.onMouseMoveHandler(this.drawingService.previewCtx, vec, mousePosition);
                } else {
                    this.bottomRightHandler = mousePosition;
                    this.drawBorder(this.drawingService.previewCtx, vec);
                }
                this.selectArea(this.drawingService.baseCtx, vec);
            }
            this.clearPath();
            this.pathData.push(vec[0]);
        }
    }

    // confirmer déplacement
    onEnter(event: MouseEvent): void {
        this.drawingService.baseCtx.putImageData(this.selectedArea, this.topLeftHandler.x, this.topLeftHandler.y);
        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawingService.previewCtx.fillRect(
            this.initialSelectionPosition.x,
            this.initialSelectionPosition.y,
            this.selectedArea.width,
            this.selectedArea.height,
        );
        this.drawingService.baseCtx.stroke();
        this.selectedArea = new ImageData(0, 0);
        this.clearPath();
        this.inSelection = false;
        this.bottomRight = false;
        this.mouseDown = false;
        this.inMovement = false;
        this.topLeftHandler = { x: 0, y: 0 };
        this.bottomRightHandler = { x: 0, y: 0 };
        this.initialSelectionPosition = { x: 0, y: 0 };
        this.initialMousePosition = { x: 0, y: 0 };
    }

    /*
    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            const vec: Vec2[] = this.rectangleService.getRectanglePoints(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.inMovement) {
                this.onMouseMoveSelection(event, this.drawingService.previewCtx);
            } else if (this.inSelection) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                // resize dynamique de la sélection avec la border box et les handlers
                this.onMouseMoveHandler(this.drawingService.previewCtx, vec, mousePosition);
            } else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                // affichage de la box pointillé
                this.drawBorder(this.drawingService.previewCtx, vec);
                // selection dynamique
                this.selectArea(this.drawingService.baseCtx, vec);
            }
            this.clearPath();
            this.pathData.push(vec[0]);
        }
    }

    onMouseUp(event: MouseEvent): void {
        // si pas en selection ni en mouvement --> affiche border et handlers, met état en sélection
        // si en selection après resize, fait rien de spécial
        // si en mouvement met à jour les canvas
        // set le basectx a blanc dans la région de la sélection
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            const vec: Vec2[] = this.rectangleService.getRectanglePoints(mousePosition);

            if (!this.inSelection && !this.inMovement) {
                this.drawSelectionBox(this.drawingService.previewCtx, vec);
                this.inSelection = true;
                this.bottomRightHandler = mousePosition;
                this.selectionHandler.setHandlersPositions(this.topLeftHandler, this.bottomRightHandler);
            }
            if (this.inSelection) {
                this.onMouseUpHandler();
            }
            if (this.inMovement) {
                this.onMouseUpSelection(event);
            }
        }
        this.mouseDown = false;
        this.clearPath();
    }*/

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
        this.bottomRight = false;
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
        this.bottomRightHandler = { x: width - 10, y: height - 10 };
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
    onMouseDownHandler(event: MouseEvent, mousePosition: Vec2): void {
        if (mousePosition.x === this.bottomRightHandler.x && mousePosition.y === this.bottomRightHandler.y) {
            this.bottomRight = true;
        } else {
            this.inSelection = false;
            this.rectangleService.onMouseDown(event);
        }
    }

    // mousemove on handler
    // doit ajuster la grandeur de la sélection en fonction du drag
    onMouseMoveHandler(ctx: CanvasRenderingContext2D, path: Vec2[], mousePosition: Vec2): void {
        if (this.bottomRight) {
            const width: number = mousePosition.x - this.topLeftHandler.x;
            const height: number = mousePosition.y - this.topLeftHandler.y;
            this.selectedArea = ctx.getImageData(this.topLeftHandler.x, this.topLeftHandler.y, width, height);
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
    onMouseDownSelection(event: MouseEvent, mousePosition: Vec2): void {
        if (
            mousePosition.x > this.topLeftHandler.x &&
            mousePosition.x < this.bottomRightHandler.x &&
            mousePosition.y > this.topLeftHandler.y &&
            mousePosition.y < this.bottomRightHandler.y
        ) {
            this.initialMousePosition = { x: event.x, y: event.y };
            this.inMovement = true;
            this.mouseDown = true;
            this.inSelection = false;
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
