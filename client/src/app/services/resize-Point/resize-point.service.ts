import { Injectable } from '@angular/core';
import * as Globals from '@app/Constants/constants';

@Injectable({
    providedIn: 'root',
})
export class ResizePoint {
    resizerBottomRight: { [key: string]: string };
    resizerRightLine: { [key: string]: string };
    resizerBottomLine: { [key: string]: string };
    resizerId: number;
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

    private setResizerRightLine(): void {
        this.resizerRightLine = {
            ['cursor']: 'col-resize',
            'margin-left': String(this.posX - Globals.CORRECTION_CONTROL_MARGIN) + 'px',
            'margin-top': String(Math.floor(this.posY / 2)) + 'px',
        };
    }

    private setResizerBottomRight(): void {
        this.resizerBottomRight = {
            ['cursor']: 'nwse-resize',
            'margin-left': String(this.posX - Globals.CORRECTION_CONTROL_MARGIN) + 'px',
            'margin-top': String(this.posY - Globals.CORRECTION_CONTROL_MARGIN) + 'px',
        };
    }

    private setResizerBottomLine(): void {
        this.resizerBottomLine = {
            ['cursor']: 'row-resize',
            'margin-left': String(Math.floor(this.posX / 2)) + 'px',
            'margin-top': String(this.posY - Globals.CORRECTION_CONTROL_MARGIN) + 'px',
        };
    }

    mouseMoveHandlerRight(event: MouseEvent): void {
        if (!this.mouseDown) {
            return;
        }
        if (this.forceMaxWidth(event)) {
            this.posX = Math.floor((window.innerWidth - Globals.SIDEBAR_WIDTH) * Globals.CANVAS_MAX_VW_MULTIPLIER);
        } else if (event.offsetX >= Globals.CANVAS_SIZE_MIN) {
            this.posX = event.offsetX;
        } else {
            this.posX = Globals.CANVAS_SIZE_MIN;
        }
        this.setResizerBottomLine();
        this.setResizerRightLine();
        this.setResizerBottomRight();
    }

    mouseMoveHandlerBottom(event: MouseEvent): void {
        if (!this.mouseDown) {
            return;
        }
        if (this.forceMaxHeight(event)) {
            this.posY = Math.floor(window.innerHeight * Globals.CANVAS_MAX_VH_MULTIPLIER);
        } else if (event.offsetY >= Globals.CANVAS_SIZE_MIN) {
            this.posY = event.offsetY;
        } else {
            this.posY = Globals.CANVAS_SIZE_MIN;
        }
        this.setResizerBottomLine();
        this.setResizerRightLine();
        this.setResizerBottomRight();
    }

    mouseMoveHandlerCorner(event: MouseEvent): void {
        if (!this.mouseDown) {
            return;
        }
        if (this.forceMaxWidth(event)) {
            this.posX = Math.floor((window.innerWidth - Globals.SIDEBAR_WIDTH) * Globals.CANVAS_MAX_VW_MULTIPLIER);
        } else if (event.offsetX >= Globals.CANVAS_SIZE_MIN) {
            this.posX = event.offsetX;
        } else {
            this.posX = Globals.CANVAS_SIZE_MIN;
        }

        if (this.forceMaxHeight(event)) {
            this.posY = Math.floor(window.innerHeight * Globals.CANVAS_MAX_VH_MULTIPLIER);
        } else if (event.offsetY >= Globals.CANVAS_SIZE_MIN) {
            this.posY = event.offsetY;
        } else {
            this.posY = Globals.CANVAS_SIZE_MIN;
        }
        this.setResizerBottomLine();
        this.setResizerRightLine();
        this.setResizerBottomRight();
    }
    private forceMaxWidth(event: MouseEvent): boolean {
        return event.offsetX >= (window.innerWidth - Globals.SIDEBAR_WIDTH) * Globals.CANVAS_MAX_VW_MULTIPLIER;
    }
    private forceMaxHeight(event: MouseEvent): boolean {
        return event.offsetY >= window.innerHeight * Globals.CANVAS_MAX_VH_MULTIPLIER;
    }
}
