import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';

const COLOR_ARRAY_LENGTH = 4;
const MAX_COLOR_VALUE = 255;
const LAST_INDEX = 3;
const PERCENTAGE_DIVIDER = 100;

@Injectable({
    providedIn: 'root',
})
export class BucketService extends Tool {
    color: string;
    private pixelStack: Vec2[];
    tolerance: number = 0;
    private added: boolean[][];
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
    }

    onRightClick(event: MouseEvent): void {
        this.drawingService.baseCtx.fillStyle = this.color;
        this.changeColorEverywhere(event);
        this.dispatchAction(this.createAction());
        this.clearPath();
        const eventContinue: CustomEvent = new CustomEvent('saveState');
        dispatchEvent(eventContinue);
    }
    onClick(event: MouseEvent): void {
        this.drawingService.baseCtx.fillStyle = this.color;
        this.localFill(event);
        this.dispatchAction(this.createAction());
        this.clearPath();
        const eventContinue: CustomEvent = new CustomEvent('saveState');
        dispatchEvent(eventContinue);
    }

    private localFill(event: MouseEvent): void {
        const image: ImageData = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);

        this.added = new Array(this.drawingService.canvas.width);
        const coords = this.getPositionFromMouse(event);
        for (let i = 0; i < this.added.length; i++) {
            this.added[i] = new Array(this.drawingService.canvas.height).fill(false);
        }

        const color = this.getColorOfPixel(coords.x, coords.y, image);

        this.pixelStack = new Array();
        this.pixelStack.push(coords);
        this.fillArea(color, image);
    }

    private fillArea(color: number[], image: ImageData): void {
        while (this.pixelStack.length !== 0) {
            const currentCoords = this.pixelStack.pop();

            if (!(currentCoords === undefined || !this.shouldReplacePixel(currentCoords, color, image))) {
                this.drawingService.baseCtx.fillRect(currentCoords.x, currentCoords.y, 1, 1);
                this.addRightPixel(currentCoords, color);
                this.addLeftPixel(currentCoords, color);
                this.addTopPixel(currentCoords, color);
                this.addBottomPixel(currentCoords, color);

                this.pathData.push(currentCoords);
            }
        }
    }

    private addLeftPixel(currentCoords: Vec2, color: number[]): void {
        if (
            currentCoords.x >= 0 &&
            this.coordsIsOnCanvas({ x: currentCoords.x - 1, y: currentCoords.y } as Vec2) &&
            !this.added[currentCoords.x - 1][currentCoords.y]
        ) {
            this.pixelStack.push({ x: currentCoords.x - 1, y: currentCoords.y } as Vec2);
            this.added[currentCoords.x - 1][currentCoords.y] = true;
        }
    }

    private addRightPixel(currentCoords: Vec2, color: number[]): void {
        if (
            currentCoords.x <= this.drawingService.baseCtx.canvas.width &&
            this.coordsIsOnCanvas({ x: currentCoords.x + 1, y: currentCoords.y } as Vec2) &&
            !this.added[currentCoords.x + 1][currentCoords.y]
        ) {
            this.pixelStack.push({ x: currentCoords.x + 1, y: currentCoords.y } as Vec2);
            this.added[currentCoords.x + 1][currentCoords.y] = true;
        }
    }

    private addTopPixel(currentCoords: Vec2, color: number[]): void {
        if (
            currentCoords.y <= this.drawingService.baseCtx.canvas.height &&
            this.coordsIsOnCanvas({ x: currentCoords.x, y: currentCoords.y + 1 } as Vec2) &&
            !this.added[currentCoords.x][currentCoords.y + 1]
        ) {
            this.pixelStack.push({ x: currentCoords.x, y: currentCoords.y + 1 } as Vec2);
            this.added[currentCoords.x][currentCoords.y + 1] = true;
        }
    }
    private addBottomPixel(currentCoords: Vec2, color: number[]): void {
        if (
            currentCoords.y >= 0 &&
            this.coordsIsOnCanvas({ x: currentCoords.x, y: currentCoords.y - 1 } as Vec2) &&
            !this.added[currentCoords.x][currentCoords.y - 1]
        ) {
            this.pixelStack.push({ x: currentCoords.x, y: currentCoords.y - 1 } as Vec2);
            this.added[currentCoords.x][currentCoords.y - 1] = true;
        }
    }
    private coordsIsOnCanvas(coords: Vec2): boolean {
        return coords.x >= 0 && coords.x < this.added.length && coords.y >= 0 && coords.y < this.added[0].length;
    }

    private getColorOfPixel(x: number, y: number, image: ImageData): number[] {
        const color: number[] = new Array(COLOR_ARRAY_LENGTH);

        color[0] = image.data[(x + y * this.drawingService.canvas.width) * COLOR_ARRAY_LENGTH];
        color[1] = image.data[(x + y * this.drawingService.canvas.width) * COLOR_ARRAY_LENGTH + 1];
        color[2] = image.data[(x + y * this.drawingService.canvas.width) * COLOR_ARRAY_LENGTH + 2];
        color[LAST_INDEX] = image.data[(x + y * this.drawingService.canvas.width) * COLOR_ARRAY_LENGTH + LAST_INDEX];

        return color;
    }

    private shouldReplacePixel(coords: Vec2, color: number[], image: ImageData): boolean {
        const currentColor = this.getColorOfPixel(coords.x, coords.y, image);

        return this.isAcceptableValue(currentColor, color);
    }

    private isAcceptableValue(current: number[], reference: number[]): boolean {
        for (let i = 0; i < current.length; i++) {
            if (Math.abs((current[i] - reference[i]) / MAX_COLOR_VALUE) > this.tolerance / PERCENTAGE_DIVIDER) {
                return false;
            }
        }
        return true;
    }

    private changeColorEverywhere(event: MouseEvent): void {
        const image: ImageData = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        const coords = this.getPositionFromMouse(event);
        const color = this.getColorOfPixel(coords.x, coords.y, image);

        for (let i = 0; i < image.data.length; i += Globals.PIXEL_SIZE) {
            const currentCoords = {
                x: (i / Globals.PIXEL_SIZE) % this.drawingService.baseCtx.canvas.width,
                y: Math.trunc(i / Globals.PIXEL_SIZE / this.drawingService.baseCtx.canvas.width),
            };
            const currentColor = [image.data[i], image.data[i + 1], image.data[i + 2], image.data[i + LAST_INDEX]];

            if (this.isAcceptableValue(currentColor, color)) {
                this.drawingService.baseCtx.fillRect(currentCoords.x, currentCoords.y, 1, 1);
                this.pathData.push(currentCoords);
            }
        }
    }

    doAction(action: DrawAction): void {
        const savedSetting = this.saveSetting();
        this.loadSetting(action.setting);
        for (const currentCoords of this.pathData) {
            this.drawingService.baseCtx.fillStyle = this.color;
            this.drawingService.baseCtx.fillRect(currentCoords.x, currentCoords.y, 1, 1);
        }
        this.loadSetting(savedSetting);
    }
}
