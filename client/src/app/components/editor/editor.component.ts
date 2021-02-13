import { Component, HostListener } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EditorService } from '@app/services/editor/editor.service';
@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    mouseDown: boolean = false;
    sizeCanvas: Vec2;
    position: number;

    constructor(public drawingService: DrawingService, public editorService: EditorService) {
        this.sizeCanvas = this.drawingService.setSizeCanva();
        this.editorService.resetControlPoints(this.sizeCanvas.x, this.sizeCanvas.y);
    }

    mouseDownHandler(event: MouseEvent, pos: number): void {
        this.mouseDown = true;
        this.position = pos;
    }
    @HostListener('mousemove', ['$event'])
    mouseMoveHandler(event: MouseEvent): void {
        switch (this.position) {
            case 0:
                this.mouseMoveHandlerCorner(event);
                break;
            case 1:
                this.mouseMoveHandlerBottom(event);
                break;
            case 2:
                this.mouseMoveHandlerRight(event);
                break;
        }
    }

    mouseMoveHandlerRight(event: MouseEvent): void {
        if (this.mouseDown) {
            if (this.verifyWidth(event)) {
                this.editorService.posX = (window.innerWidth - Globals.SIDEBAR_WIDTH) * Globals.CANVAS_MAX_VW_MULTIPLIER;
            } else if (event.offsetX >= Globals.CANVAS_SIZE_MIN) {
                this.editorService.posX = event.offsetX;
            } else {
                this.editorService.posX = Globals.CANVAS_SIZE_MIN;
            }
            this.editorService.setResizerBottomLine();
            this.editorService.setResizerRightLine();
            this.editorService.setResizerBottomRight();
        }
    }

    mouseMoveHandlerBottom(event: MouseEvent): void {
        if (this.mouseDown) {
            if (this.verifyHeight(event)) {
                this.editorService.posY = window.innerHeight * Globals.CANVAS_MAX_VH_MULTIPLIER;
            } else if (event.offsetY >= Globals.CANVAS_SIZE_MIN) {
                this.editorService.posY = event.offsetY;
            } else {
                this.editorService.posY = Globals.CANVAS_SIZE_MIN;
            }
            this.editorService.setResizerBottomLine();
            this.editorService.setResizerRightLine();
            this.editorService.setResizerBottomRight();
        }
    }

    mouseMoveHandlerCorner(event: MouseEvent): void {
        if (this.mouseDown) {
            if (this.verifyWidth(event)) {
                this.editorService.posX = (window.innerWidth - Globals.SIDEBAR_WIDTH) * Globals.CANVAS_MAX_VW_MULTIPLIER;
            } else if (event.offsetX >= Globals.CANVAS_SIZE_MIN) {
                this.editorService.posX = event.offsetX;
            } else {
                this.editorService.posX = Globals.CANVAS_SIZE_MIN;
            }

            if (this.verifyHeight(event)) {
                this.editorService.posY = window.innerHeight * Globals.CANVAS_MAX_VH_MULTIPLIER;
            } else if (event.offsetY >= Globals.CANVAS_SIZE_MIN) {
                this.editorService.posY = event.offsetY;
            } else {
                this.editorService.posY = Globals.CANVAS_SIZE_MIN;
            }
            this.editorService.setResizerBottomLine();
            this.editorService.setResizerRightLine();
            this.editorService.setResizerBottomRight();
        }
    }
    verifyWidth(event: MouseEvent): boolean {
        if (event.offsetX >= (window.innerWidth - Globals.SIDEBAR_WIDTH) * Globals.CANVAS_MAX_VW_MULTIPLIER) {
            return true;
        }
        return false;
    }
    verifyHeight(event: MouseEvent): boolean {
        if (event.offsetY >= window.innerHeight * Globals.CANVAS_MAX_VH_MULTIPLIER) {
            return true;
        }
        return false;
    }

    @HostListener('mouseup', ['$event'])
    mouseUpHandler(event: MouseEvent): void {
        this.mouseDown = false;
    }

    hideResizer(): boolean {
        return !this.mouseDown;
    }
}
0;
