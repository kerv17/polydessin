import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
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
export class DrawingComponent implements AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    constructor(private drawingService: DrawingService, private colorService: ColorService, private controller: ToolControllerService) {}

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        // met la surface en blanc mais c aussi fait sans ce code
        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.controller.currentTool.color = this.colorService.primaryColor;
        this.controller.currentTool.color2 = this.colorService.secondaryColor;
        // need to find where to put this
        // document.documentElement.clientHeight;
        // document.documentElement.clientHeight;
        // ne fait rien
        // this.setDrawingSurface();
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

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
        this.controller.currentTool.onMouseLeave(event);
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
        this.controller.currentTool.onMouseEnter(event);
    }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent): void {
        this.controller.currentTool.onClick(event);
    }
    /*setDrawingSurface():void{
        let halfWindowHeight:number = document.documentElement.clientHeight/2;
        let halfWindowidth:number = document.documentElement.clientWidth/2;
        let minSize:number = 250;
        if(halfWindowHeight < minSize){
            this.canvasSize.y = minSize;
        } else if (halfWindowidth < minSize) {
            this.canvasSize.x = minSize;
        } else {
            this.canvasSize = { x: halfWindowidth, y: halfWindowHeight };
        }

    }*/
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
}
