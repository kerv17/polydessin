import { Component, HostListener } from '@angular/core';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    mouseDown: boolean = false;
    posX: number;
    posY: number;
    position: number;

    constructor(private drawingService: DrawingService) {
        this.drawingService.setSizeCanva();
        this.posX = this.drawingService.controlSize.x;
        this.posY = this.drawingService.controlSize.y;
        this.setResizerBottomLine();
        this.setResizerRightLine();
        this.setResizerBottomRight();
    }

    resizerBottomLine: { [key: string]: string };
    resizerRightLine: { [key: string]: string };
    resizerBottomRight: { [key: string]: string };

    setResizerRightLine(): void {
        this.resizerRightLine = {
            ['cursor']: 'col-resize',
            'margin-left': String(this.posX - Globals.CORRECTION_CONTROL_MARGIN) + 'px',
            'margin-top': String(this.posY / 2) + 'px',
        };
    }

    setResizerBottomRight(): void {
        this.resizerBottomRight = {
            ['cursor']: 'nwse-resize',
            'margin-left': String(this.posX - Globals.CORRECTION_CONTROL_MARGIN) + 'px',
            'margin-top': String(this.posY - Globals.CORRECTION_CONTROL_MARGIN) + 'px',
        };
    }

    setResizerBottomLine(): void {
        this.resizerBottomLine = {
            ['cursor']: 'row-resize',
            'margin-left': String(this.posX / 2) + 'px',
            'margin-top': String(this.posY - Globals.CORRECTION_CONTROL_MARGIN) + 'px',
        };
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
                this.posX = (window.innerWidth - Globals.SIDEBAR_WIDTH) * Globals.CANVAS_MAX_VW_MULTIPLIER;
            } else if (event.offsetX >= Globals.CANVAS_SIZE_MIN) {
                this.posX = event.offsetX;
            } else {
                this.posX = Globals.CANVAS_SIZE_MIN;
            }
            this.setResizerBottomLine();
            this.setResizerRightLine();
            this.setResizerBottomRight();
        }
    }

    mouseMoveHandlerBottom(event: MouseEvent): void {
        if (this.mouseDown) {
            if (this.verifyHeight(event)) {
                this.posY = window.innerHeight * Globals.CANVAS_MAX_VH_MULTIPLIER;
            } else if (event.offsetY >= Globals.CANVAS_SIZE_MIN) {
                this.posY = event.offsetY;
            } else {
                this.posY = Globals.CANVAS_SIZE_MIN;
            }
            this.setResizerBottomLine();
            this.setResizerRightLine();
            this.setResizerBottomRight();
        }
    }

    mouseMoveHandlerCorner(event: MouseEvent): void {
        if (this.mouseDown) {
            if (this.verifyWidth(event)) {
                this.posX = (window.innerWidth - Globals.SIDEBAR_WIDTH) * Globals.CANVAS_MAX_VW_MULTIPLIER;
            } else if (event.offsetX >= Globals.CANVAS_SIZE_MIN) {
                this.posX = event.offsetX;
            } else {
                this.posX = Globals.CANVAS_SIZE_MIN;
            }

            if (this.verifyHeight(event)) {
                this.posY = window.innerHeight * Globals.CANVAS_MAX_VH_MULTIPLIER;
            } else if (event.offsetY >= Globals.CANVAS_SIZE_MIN) {
                this.posY = event.offsetY;
            } else {
                this.posY = Globals.CANVAS_SIZE_MIN;
            }
            this.setResizerBottomLine();
            this.setResizerRightLine();
            this.setResizerBottomRight();
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
