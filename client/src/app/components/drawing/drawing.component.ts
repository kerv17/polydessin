import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { CarouselService } from '@app/services/Carousel/carousel.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit, OnChanges {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    @Input()
    widthPrev: number;

    @Input()
    heightPrev: number;

    @Input()
    mouseDown: boolean;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;

    private canvasSize: Vec2;
    private previousCanvasSize: Vec2;
    private newCanvasSize: Vec2;
    private viewInitialized: boolean = false;

    selectionBox: { [key: string]: string };
    handler0: { [key: string]: string };
    handler1: { [key: string]: string };
    handler2: { [key: string]: string };
    handler3: { [key: string]: string };
    handler4: { [key: string]: string };
    handler5: { [key: string]: string };
    handler6: { [key: string]: string };
    handler7: { [key: string]: string };

    constructor(
        private drawingService: DrawingService,
        private colorService: ColorService,
        private controller: ToolControllerService,
        private carousel: CarouselService,
    ) {
        this.canvasSize = this.drawingService.setSizeCanva();
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(0, 0, this.drawingService.canvasSize.x, this.drawingService.canvasSize.y);
        this.drawingService.previewCanvas = this.previewCanvas.nativeElement;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.controller.currentTool.color = this.colorService.primaryColor;
        this.controller.currentTool.color2 = this.colorService.secondaryColor;
        this.viewInitialized = true;
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

                this.baseCtx.putImageData(dessin, 0, 0);

                this.drawingService.fillNewSpace(this.previousCanvasSize, this.newCanvasSize);
            }
        }
    }

    @HostListener('mousemove', ['$event'])
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

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
        this.controller.currentTool.onMouseLeave(event);
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
        this.controller.currentTool.onMouseEnter(event);
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

    // A deplacer dans service
    drawSelectionBox(): boolean {
        if (this.controller.selectionService.inSelection) {
            this.selectionBox = {
                height: this.controller.selectionService.selectedArea.height + 'px',
                width: this.controller.selectionService.selectedArea.width + 'px',
                border: '2px solid blue',
                position: 'absolute',
                left: this.controller.selectionService.topLeftHandler.x + 1 + 'px',
                top: this.controller.selectionService.topLeftHandler.y + 1 + 'px',
            };
            return true;
        }
        return false;
    }

    // afficher handlers
    // A deplacer dans service
    drawHandlers(): boolean {
        if (this.controller.selectionService.inSelection) {
            this.controller.selectionService.setHandlersPositions(
                this.controller.selectionService.topLeftHandler,
                this.controller.selectionService.bottomRightHandler,
            );
            this.handler0 = {
                left: this.controller.selectionService.handlersPositions[Globals.TOP_LEFT_HANDLER].x - Globals.HANDLERS_POSITION + 'px',
                top: this.controller.selectionService.handlersPositions[Globals.TOP_LEFT_HANDLER].y - Globals.HANDLERS_POSITION + 'px',
            };
            this.handler1 = {
                left: this.controller.selectionService.handlersPositions[Globals.TOP_HANDLER].x - Globals.HANDLERS_POSITION + 'px',
                top: this.controller.selectionService.handlersPositions[Globals.TOP_HANDLER].y - Globals.HANDLERS_POSITION + 'px',
            };
            this.handler2 = {
                left: this.controller.selectionService.handlersPositions[Globals.TOP_RIGHT_HANDLER].x - Globals.HANDLERS_POSITION + 'px',
                top: this.controller.selectionService.handlersPositions[Globals.TOP_RIGHT_HANDLER].y - Globals.HANDLERS_POSITION + 'px',
            };
            this.handler3 = {
                left: this.controller.selectionService.handlersPositions[Globals.RIGHT_HANDLER].x - Globals.HANDLERS_POSITION + 'px',
                top: this.controller.selectionService.handlersPositions[Globals.RIGHT_HANDLER].y - Globals.HANDLERS_POSITION + 'px',
            };
            this.handler4 = {
                left: this.controller.selectionService.handlersPositions[Globals.BOTTOM_RIGHT_HANDLER].x - Globals.HANDLERS_POSITION + 'px',
                top: this.controller.selectionService.handlersPositions[Globals.BOTTOM_RIGHT_HANDLER].y - Globals.HANDLERS_POSITION + 'px',
            };
            this.handler5 = {
                left: this.controller.selectionService.handlersPositions[Globals.BOTTOM_HANDLER].x - Globals.HANDLERS_POSITION + 'px',
                top: this.controller.selectionService.handlersPositions[Globals.BOTTOM_HANDLER].y - Globals.HANDLERS_POSITION + 'px',
            };
            this.handler6 = {
                left: this.controller.selectionService.handlersPositions[Globals.BOTTOM_LEFT_HANDLER].x - Globals.HANDLERS_POSITION + 'px',
                top: this.controller.selectionService.handlersPositions[Globals.BOTTOM_LEFT_HANDLER].y - Globals.HANDLERS_POSITION + 'px',
            };
            this.handler7 = {
                left: this.controller.selectionService.handlersPositions[Globals.LEFT_HANDLER].x - Globals.HANDLERS_POSITION + 'px',
                top: this.controller.selectionService.handlersPositions[Globals.LEFT_HANDLER].y - Globals.HANDLERS_POSITION + 'px',
            };
            return true;
        } else {
            return false;
        }
    }
    loadCarouselCanvas(): void {
        if (this.carousel.loadImage) {
            this.carousel.loadImage = false;
            this.drawingService.loadOldCanvas(this.carousel.imageToLoad);
            this.carousel.close();
        }
    }
}
