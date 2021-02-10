import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';

// TODO : Avoir un fichier séparé pour les constantes ?
export const DEFAULT_WIDTH = 1000;
export const DEFAULT_HEIGHT = 800;

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

    // TODO : Avoir un service dédié pour gérer tous les outils ? Ceci peut devenir lourd avec le temps

    constructor(private drawingService: DrawingService, private colorService: ColorService, private controller: ToolControllerService) {
        this.canvasSize = this.drawingService.setSizeCanva();
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        // met la surface en blanc mais c aussi fait sans ce code
        // this.baseCtx.fillStyle = "white";
        // this.baseCtx.fillRect(0,0,DEFAULT_WIDTH,DEFAULT_HEIGHT);
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.controller.currentTool.color = this.colorService.primaryColor;
        this.controller.currentTool.color2 = this.colorService.secondaryColor;
        this.canvasSize = this.drawingService.setSizeCanva();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.mouseDown) {
            if (changes.widthPrev) {
                this.previewCanvas.nativeElement.width = this.widthPrev;
            }
            if (changes.heightPrev) {
                this.previewCanvas.nativeElement.height = this.heightPrev;
            }
        } else {
            const dessin = this.baseCtx.getImageData(0, 0, this.widthPrev, this.heightPrev);
            this.baseCanvas.nativeElement.width = this.widthPrev;
            this.baseCanvas.nativeElement.height = this.heightPrev;
            this.baseCtx.putImageData(dessin, 0, 0);
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

    @HostListener('mouseup', ['$event'])
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

    /*setDrawingSurface():void{
        let halfWindowHeight:number = document.documentElement.clientHeight/2;
        let halfWindowidth:number = document.documentElement.clientWidth/2;
        let minSize:number = 250;
        if(halfWindowHeight < minSize){
            this.canvasSize.y = minSize;
        }
        else if(halfWindowidth < minSize){
            this.canvasSize.x = minSize;
        }
        else{
            this.canvasSize = { x: halfWindowidth, y: halfWindowHeight };
        }

    }*/

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
