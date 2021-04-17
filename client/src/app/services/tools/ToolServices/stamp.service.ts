import { Injectable } from '@angular/core';
import { Setting, Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';

export const path = '../../../../assets/Stamp/';
export const angleTurnPerRotation = 15;
export const maxImageSize = 250;

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    pointWidth: number = 0; // Used for the angle of the stamp
    toolMode: string = 'forsenCD.png';
    scaleRatio: number = 20;

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }
    onClick(event: MouseEvent): void {
        if (event.button === Globals.MouseButton.Left) {
            this.pathData = [this.getPositionFromMouse(event)];
            this.drawStamp(this.drawingService.baseCtx);
            this.dispatchAction(this.createAction());
            this.clearPreviewCtx();
            const eventContinue: CustomEvent = new CustomEvent('saveState');
            dispatchEvent(eventContinue);
        }
    }

    onWheel(event: WheelEvent): void {
        const rotationAmount = event.altKey ? 1 : angleTurnPerRotation;
        this.pointWidth += event.deltaY > 0 ? rotationAmount : -rotationAmount;
        this.clearPreviewCtx();
        this.drawStamp(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent): void {
        this.pathData = [this.getPositionFromMouse(event)];
        this.clearPreviewCtx();
        this.drawStamp(this.drawingService.previewCtx);
    }

    setStampRotationScale(ctx: CanvasRenderingContext2D, orientation: number): void {
        ctx.translate(this.pathData[0].x, this.pathData[0].y);
        ctx.rotate(this.convertDegToRad(orientation));
        ctx.scale(this.width / this.scaleRatio, this.width / this.scaleRatio);
        ctx.translate(-this.pathData[0].x, -this.pathData[0].y);
    }

    drawStamp(ctx: CanvasRenderingContext2D): void {
        this.setStampRotationScale(ctx, this.pointWidth);
        const image = new Image();
        image.src = path + this.toolMode;
        const imageSize = this.scaleImage(image);
        ctx.translate(-imageSize.x / 2, -imageSize.y / 2);
        ctx.drawImage(image, this.pathData[0].x, this.pathData[0].y, imageSize.x, imageSize.y);
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the canvas transform
    }

    doAction(action: DrawAction): void {
        const previousSetting: Setting = this.saveSetting();
        this.loadSetting(action.setting);
        this.drawStamp(this.drawingService.baseCtx);
        this.loadSetting(previousSetting);
    }

    convertDegToRad(deg: number): number {
        // tslint:disable-next-line: no-magic-numbers
        return deg * Math.PI / 180;
    }

    scaleImage(img: HTMLImageElement): Vec2 {
        return { x: maxImageSize / img.naturalWidth * img.naturalHeight, y: maxImageSize };
    }
}
