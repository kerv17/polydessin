import { Component, HostListener } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EditorService } from '@app/services/editor/editor.service';
import { ResizedEvent } from 'angular-resize-event';
@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    sizeCanvas: Vec2;
    container: { [key: string]: string };
    editorSizeX: number;
    editorSizeY: number;

    constructor(public drawingService: DrawingService, public editorService: EditorService) {
        this.sizeCanvas = this.drawingService.setSizeCanva();
        this.editorService.resetControlPoints(this.sizeCanvas.x, this.sizeCanvas.y);
    }

    onResize(event: ResizedEvent): void {
        if (window.innerHeight < this.editorService.posY) {
            this.editorSizeY = this.editorService.posY * 1.1;
        }
        if (window.innerWidth - Globals.SIDEBAR_WIDTH < this.editorService.posX) {
            this.editorSizeX = (this.editorService.posX + Globals.SIDEBAR_WIDTH) * 1.1;
        }
        if (window.innerHeight > this.editorService.posY) {
            this.editorSizeY = window.innerHeight;
        }
        if (window.innerWidth - Globals.SIDEBAR_WIDTH > this.editorService.posX) {
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
        this.editorService.mouseDown = true;
        this.editorService.position = pos;
    }
    @HostListener('mousemove', ['$event'])
    mouseMoveHandler(event: MouseEvent): void {
        switch (this.editorService.position) {
            case 0:
                this.editorService.mouseMoveHandlerCorner(event);
                break;
            case 1:
                this.editorService.mouseMoveHandlerBottom(event);
                break;
            case 2:
                this.editorService.mouseMoveHandlerRight(event);
                break;
        }
    }

    @HostListener('mouseup', ['$event'])
    mouseUpHandler(event: MouseEvent): void {
        this.editorService.mouseDown = false;
    }

    hideResizer(): boolean {
        return !this.editorService.mouseDown;
    }
}
0;
