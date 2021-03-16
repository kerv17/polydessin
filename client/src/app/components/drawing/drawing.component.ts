import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, HostListener } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionBoxService } from '@app/services/selectionBox/selection-box.service';
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

    mouseOut: boolean = false;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;


    private canvasSize: Vec2;
    private previousCanvasSize: Vec2;
    private newCanvasSize: Vec2;
    private viewInitialized: boolean = false;

    cursor: { [key: string]: string };

    constructor(
        private drawingService: DrawingService,
        private colorService: ColorService,
        private controller: ToolControllerService,
        public selectionBoxLayout: SelectionBoxService,
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
        const bottomRight = {
            x: this.controller.selectionService.topLeftHandler.x + this.controller.selectionService.selectedArea.width,
            y: this.controller.selectionService.topLeftHandler.y + this.controller.selectionService.selectedArea.height,
        };
        if (
            event.offsetX > this.controller.selectionService.topLeftHandler.x &&
            event.offsetX < bottomRight.x &&
            event.offsetY > this.controller.selectionService.topLeftHandler.y &&
            event.offsetY < bottomRight.y &&
            this.controller.selectionService.inSelection
        ) {
            this.cursor = {
                cursor: 'all-scroll',
            };
        } else {
            this.cursor = {
                cursor: 'crosshair',
            };
        }
    }

    drawSelectionBox(): boolean {
        if (this.controller.selectionService.inSelection) {
            this.selectionBoxLayout.drawSelectionBox(
                this.controller.selectionService.topLeftHandler,
                this.controller.selectionService.selectedArea.width,
                this.controller.selectionService.selectedArea.height,
            );
            return true;
        }
        return false;
    }

    drawHandlers(): boolean {
        if (this.controller.selectionService.inSelection) {
            const bottomRight = {
                x: this.controller.selectionService.topLeftHandler.x + this.controller.selectionService.selectedArea.width,
                y: this.controller.selectionService.topLeftHandler.y + this.controller.selectionService.selectedArea.height,
            };
            this.selectionBoxLayout.setHandlersPositions(this.controller.selectionService.topLeftHandler, bottomRight);
            this.selectionBoxLayout.drawHandlers();
            return true;
        } else {
            return false;
        }
    }
}
