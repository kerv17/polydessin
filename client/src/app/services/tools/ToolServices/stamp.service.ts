import { Injectable } from '@angular/core';
import { Setting, Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';

const path = '../../../../assets/Stamp/';
const angleTurnPerRotation = 15;

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    pointWidth: number = 0;
    imageList: string[] = ['heart.png'];
    toolMode: string = this.imageList[0];

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }
    onClick(event: MouseEvent): void {
        this.pathData = [this.getPositionFromMouse(event)];

        this.drawStamp(this.drawingService.baseCtx);
        this.dispatchAction(this.createAction());
        this.clearPreviewCtx();
    }

    onWheel(event: WheelEvent): void {
        this.pointWidth += event.deltaY > 0 ? angleTurnPerRotation : -angleTurnPerRotation;
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
        ctx.scale(this.width / 25, this.width / 25);
        ctx.translate(-this.pathData[0].x, -this.pathData[0].y);
    }

    drawStamp(ctx: CanvasRenderingContext2D): void {
        this.setStampRotationScale(ctx, this.pointWidth);
        const image = new Image();
        image.src = path + this.toolMode;

        ctx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);
        ctx.drawImage(image, this.pathData[0].x, this.pathData[0].y);
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the canvas transform
    }

    doAction(action: DrawAction): void {
        const previousSetting: Setting = this.saveSetting();
        this.loadSetting(action.setting);
        this.drawStamp(this.drawingService.baseCtx);
        this.loadSetting(previousSetting);
    }

    convertDegToRad(deg: number): number {
        return (deg * Math.PI) / 180;
    }
}
