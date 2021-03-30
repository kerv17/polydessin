import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/grid/grid.service';
import { SelectionBoxService } from '@app/services/selectionBox/selection-box.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { DrawingAction } from '@app/services/tools/undoRedo/undo-redo.service';
@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit, OnChanges {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    // on utilise ce canvas pour afficher la grille
    @ViewChild('gridCanvas', { static: false }) gridCanvas: ElementRef<HTMLCanvasElement>;

    @Input()
    widthPrev: number;

    @Input()
    heightPrev: number;

    @Input()
    mouseDown: boolean;

    mouseOut: boolean = false;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private gridCtx: CanvasRenderingContext2D;

    private canvasSize: Vec2;
    private previousCanvasSize: Vec2;
    private newCanvasSize: Vec2;
    private viewInitialized: boolean = false;

    private allowUndoCall: boolean = true;

    constructor(
        private drawingService: DrawingService,
        private colorService: ColorService,
        private controller: ToolControllerService,
        private carousel: CarouselService,
        public selectionBoxLayout: SelectionBoxService,
        private gridService: GridService,
    ) {
        this.canvasSize = this.drawingService.initializeCanvas();
        addEventListener('allowUndoCall', (event: CustomEvent) => {
            this.allowUndoCall = event.detail;
        });
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridCtx = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(0, 0, this.drawingService.canvasSize.x, this.drawingService.canvasSize.y);
        this.drawingService.previewCanvas = this.previewCanvas.nativeElement;
        this.drawingService.gridCanvas = this.gridCanvas.nativeElement;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.gridCtx = this.gridCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.controller.currentTool.color = this.colorService.primaryColor;
        this.controller.currentTool.color2 = this.colorService.secondaryColor;
        this.viewInitialized = true;
        const action: DrawingAction = {
            type: 'Drawing',
            drawing: this.baseCtx.getImageData(0, 0, this.drawingService.canvasSize.x, this.drawingService.canvasSize.y),
            width: this.drawingService.canvasSize.x,
            height: this.drawingService.canvasSize.y,
        };
        const event: CustomEvent = new CustomEvent('undoRedoWipe', { detail: action });
        dispatchEvent(event);
        this.loadCarouselCanvas();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.viewInitialized) {
            if (this.mouseDown) {
                if (changes.widthPrev) {
                    this.previewCanvas.nativeElement.width = this.widthPrev;
                }
                if (changes.heightPrev) {
                    this.previewCanvas.nativeElement.height = this.heightPrev;
                }
            } else {
                if (this.controller.selectionService.inSelection) {
                    this.controller.selectionService.onEscape();
                }
                this.previousCanvasSize = { x: this.baseCanvas.nativeElement.width, y: this.baseCanvas.nativeElement.height };
                this.newCanvasSize = { x: this.widthPrev, y: this.heightPrev };
                const dessin = this.baseCtx.getImageData(0, 0, this.widthPrev, this.heightPrev);

                this.baseCanvas.nativeElement.width = this.widthPrev;
                this.baseCanvas.nativeElement.height = this.heightPrev;
                this.previewCanvas.nativeElement.width = this.widthPrev;
                this.previewCanvas.nativeElement.height = this.heightPrev;
                this.gridCtx.canvas.width = this.widthPrev;
                this.gridCtx.canvas.height = this.heightPrev;
                // this.gridCtx.fillStyle = 'rgba(200,20,70,1)';
                // this.gridCtx.fillRect(10, 10, 55, 50);
                const eventGrid: CustomEvent = new CustomEvent('grid', { detail: 'drawingAction' });
                dispatchEvent(eventGrid);
                this.gridService.drawGrid(); // a enlever quand grid est dans sidebar

                this.baseCtx.putImageData(dessin, 0, 0);
                this.drawingService.fillNewSpace(this.previousCanvasSize, this.newCanvasSize);
                if (this.allowUndoCall) {
                    const drawingAction: DrawingAction = {
                        type: 'Drawing',
                        drawing: this.drawingService.baseCtx.getImageData(0, 0, this.newCanvasSize.x, this.newCanvasSize.y),
                        width: this.newCanvasSize.x,
                        height: this.newCanvasSize.y,
                    };
                    const event: CustomEvent = new CustomEvent('action', { detail: drawingAction });
                    dispatchEvent(event);
                }
                this.allowUndoCall = true;
            }
        }
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
        this.controller.currentTool.onMouseLeave(event);
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
        this.controller.currentTool.onMouseEnter(event);
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.controller.currentTool.color = this.colorService.primaryColor;
        this.controller.currentTool.color2 = this.colorService.secondaryColor;
        this.controller.currentTool.onMouseMove(event);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.controller.currentTool.color = this.colorService.primaryColor;
        this.controller.currentTool.color2 = this.colorService.secondaryColor;
        this.controller.currentTool.onMouseDown(event);
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.controller.currentTool.onMouseUp(event);
        this.controller.currentTool.color = this.colorService.primaryColor;
        this.controller.currentTool.color2 = this.colorService.secondaryColor;
    }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent): void {
        this.controller.currentTool.onClick(event);
    }

    @HostListener('dblclick', ['$event'])
    ondbClick(event: MouseEvent): void {
        this.controller.currentTool.ondbClick(event);
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    getCurrentTool(): Tool {
        return this.controller.currentTool;
    }

    cursorChange(event: MouseEvent): void {
        this.selectionBoxLayout.cursorChange(
            event,
            this.controller.selectionService.inSelection,
            this.controller.selectionService.getActualPosition(),
            this.controller.selectionService.getSelectionWidth(),
            this.controller.selectionService.getSelectionHeight(),
        );
    }

    drawSelectionBox(): boolean {
        if (this.controller.selectionService.inSelection) {
            this.selectionBoxLayout.drawSelectionBox(
                this.controller.selectionService.getActualPosition(),
                this.controller.selectionService.getSelectionWidth(),
                this.controller.selectionService.getSelectionHeight(),
            );
            this.selectionBoxLayout.setHandlersPositions(
                this.controller.selectionService.getActualPosition(),
                this.controller.selectionService.getSelectionWidth(),
                this.controller.selectionService.getSelectionHeight(),
            );
            return true;
        }
        return false;
    }

    drawHandlers(): boolean {
        return this.controller.selectionService.inSelection;
    }
    loadCarouselCanvas(): void {
        if (this.carousel.loadImage) {
            this.carousel.loadImage = false;
            this.drawingService.loadOldCanvas(this.carousel.imageToLoad);
            this.carousel.showLoad = false;
            this.carousel.close();
        }
    }
}
