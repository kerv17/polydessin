import { Injectable } from '@angular/core';
import * as Globals from '@app/Constants/constants';

@Injectable({
    providedIn: 'root',
})
export class EditorService {
    resizerBottomRight: { [key: string]: string };
    resizerRightLine: { [key: string]: string };
    resizerBottomLine: { [key: string]: string };
    position: number;
    mouseDown: boolean = false;

    posX: number;
    posY: number;

    resetControlPoints(canvasWidth: number, canvasHeight: number): void {
        this.posX = canvasWidth;
        this.posY = canvasHeight;
        this.setResizerBottomLine();
        this.setResizerRightLine();
        this.setResizerBottomRight();
    }

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
}
