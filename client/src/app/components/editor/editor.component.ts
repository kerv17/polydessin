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

    // resizerBottomLine: { [key: string]: string };
    // resizerRightLine: { [key: string]: string };
    // resizerBottomRight: { [key: string]: string };
    /*
    setResizerRightLine(): void {
        this.drawingService.resizerRightLine = {
            cursor: 'col-resize',
            'margin-left': String(this.drawingService.posX - Globals.CORRECTION_CONTROL_MARGIN) + 'px',
            'margin-top': String(this.drawingService.posY / 2) + 'px',
        };
    }

    setResizerBottomRight(): void {
        this.drawingService.resizerBottomRight = {
            cursor: 'nwse-resize',
            'margin-left': String(this.drawingService.posX - Globals.CORRECTION_CONTROL_MARGIN) + 'px',
            'margin-top': String(this.drawingService.posY - Globals.CORRECTION_CONTROL_MARGIN) + 'px',
        };
    }

    setResizerBottomLine(): void {
        this.drawingService.resizerBottomLine = {
            cursor: 'row-resize',
            'margin-left': String(this.drawingService.posX / 2) + 'px',
            'margin-top': String(this.drawingService.posY - Globals.CORRECTION_CONTROL_MARGIN) + 'px',
        };
    }
*/
    mouseDownHandler(event: MouseEvent, pos: number): void {
        this.mouseDown = true;
        this.position = pos;
    }
    @HostListener('mousemove', ['$event'])
    mouseMoveHandler(event: MouseEvent): void {
        if (this.position === 0) {
            this.mouseMoveHandlerCorner(event);
        } else if (this.position === 1) {
            this.mouseMoveHandlerBottom(event);
        } else if (this.position === 2) {
            this.mouseMoveHandlerRight(event);
        }
    }

    mouseMoveHandlerRight(event: MouseEvent): void {
        if (this.mouseDown) {
            if (event.offsetX >= Globals.CANVAS_SIZE_MIN) {
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
            if (event.offsetY >= Globals.CANVAS_SIZE_MIN) {
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
            if (event.offsetX >= Globals.CANVAS_SIZE_MIN) {
                this.editorService.posX = event.offsetX;
            } else {
                this.editorService.posX = Globals.CANVAS_SIZE_MIN;
            }

            if (event.offsetY >= Globals.CANVAS_SIZE_MIN) {
                this.editorService.posY = event.offsetY;
            } else {
                this.editorService.posY = Globals.CANVAS_SIZE_MIN;
            }
            this.editorService.setResizerBottomLine();
            this.editorService.setResizerRightLine();
            this.editorService.setResizerBottomRight();
        }
    }

    @HostListener('mouseup', ['$event'])
    mouseUpHandler(event: MouseEvent): void {
        this.mouseDown = false;
    }

    hideResizer(): boolean {
        return !this.mouseDown;
    }
}
