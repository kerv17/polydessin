import { Component, HostListener } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { ResizedEvent } from 'angular-resize-event';
@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    container: { [key: string]: string };
    sizeCanvasOnReset: Vec2;
    editorSizeY: number;
    editorSizeX: number;

    constructor(public drawingService: DrawingService, public controller: ToolControllerService, public colorService: ColorService) {
        this.sizeCanvasOnReset = this.drawingService.setSizeCanva();
        this.drawingService.resizePoint.resetControlPoints(this.sizeCanvasOnReset.x, this.sizeCanvasOnReset.y);
    }

    onResize(event: ResizedEvent): void {
        if (window.innerHeight < this.drawingService.resizePoint.posY) {
            // because JS creates decimals https://medium.com/@DominicCarmel/understanding-javascripts-weird-decimal-calculations-e65f0e1adefb
            this.editorSizeY = Math.floor(this.drawingService.resizePoint.posY * Globals.CONSTANTE_AGRANDISSEMENT_TRAVAIL);
        }
        if (window.innerWidth - Globals.SIDEBAR_WIDTH < this.drawingService.resizePoint.posX) {
            this.editorSizeX = Math.floor((this.drawingService.resizePoint.posX + Globals.SIDEBAR_WIDTH) * Globals.CONSTANTE_AGRANDISSEMENT_TRAVAIL);
        }
        if (window.innerHeight > this.drawingService.resizePoint.posY) {
            this.editorSizeY = window.innerHeight;
        }
        if (window.innerWidth - Globals.SIDEBAR_WIDTH > this.drawingService.resizePoint.posX) {
            this.editorSizeX = window.innerWidth;
        }
        this.setContainerSize();
    }
    setContainerSize(): void {
        this.container = {
            width: String(this.editorSizeX) + 'px',
            height: String(this.editorSizeY) + 'px',
        };
    }
    mouseDownHandler(event: MouseEvent, pos: number): void {
        this.drawingService.resizePoint.mouseDown = true;
        this.drawingService.resizePoint.resizerId = pos;
    }

    @HostListener('mousemove', ['$event'])
    mouseMoveHandler(event: MouseEvent): void {
        switch (this.drawingService.resizePoint.resizerId) {
            case 0:
                this.drawingService.resizePoint.mouseMoveHandlerCorner(event);
                break;
            case 1:
                this.drawingService.resizePoint.mouseMoveHandlerBottom(event);
                break;
            case 2:
                this.drawingService.resizePoint.mouseMoveHandlerRight(event);
                break;
        }
    }



    @HostListener('mouseup', ['$event'])
    mouseUpHandler(event: MouseEvent): void {
        this.drawingService.resizePoint.mouseDown = false;
    }

    hideResizer(): boolean {
        return !this.drawingService.resizePoint.mouseDown;
    }
}
