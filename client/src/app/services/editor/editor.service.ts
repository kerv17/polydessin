import { Injectable } from '@angular/core';
import * as Globals from '@app/Constants/constants';

@Injectable({
    providedIn: 'root',
})
export class EditorService {
    resizerBottomRight: { [key: string]: string };
    resizerRightLine: { [key: string]: string };
    resizerBottomLine: { [key: string]: string };

    posX: number;
    posY: number;

    constructor() {}

    resetControlPoints(canvasWidth: number, canvasHeight: number): void {
        this.posX = canvasWidth;
        this.posY = canvasHeight;
        this.setResizerBottomLine();
        this.setResizerRightLine();
        this.setResizerBottomRight();
    }

    setResizerRightLine(): void {
        this.resizerRightLine = {
            cursor: 'col-resize',
            'margin-left': String(this.posX - Globals.CORRECTION_CONTROL_MARGIN) + 'px',
            'margin-top': String(this.posY / 2) + 'px',
        };
    }

    setResizerBottomRight(): void {
        this.resizerBottomRight = {
            cursor: 'nwse-resize',
            'margin-left': String(this.posX - Globals.CORRECTION_CONTROL_MARGIN) + 'px',
            'margin-top': String(this.posY - Globals.CORRECTION_CONTROL_MARGIN) + 'px',
        };
    }

    setResizerBottomLine(): void {
        this.resizerBottomLine = {
            cursor: 'row-resize',
            'margin-left': String(this.posX / 2) + 'px',
            'margin-top': String(this.posY - Globals.CORRECTION_CONTROL_MARGIN) + 'px',
        };
    }
}
