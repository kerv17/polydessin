import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
@Injectable({
    providedIn: 'root',
})
export class BucketService extends Tool {
    color: string;
    private pixelStack: Vec2[];
    tolerance: number = 0;
    added: boolean[][];
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
    }

    onClick(event: MouseEvent): void {
        this.drawingService.baseCtx.fillStyle = this.color;
        this.changeAllPixels(event);
    }

    changeAllPixels(event: MouseEvent): void {
        const image: ImageData = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);

        const coords = this.getPositionFromMouse(event);
        this.added = new Array(this.drawingService.canvas.width);

        for (let i = 0; i < this.added.length; i++) {
            this.added[i] = new Array(this.drawingService.canvas.height).fill(false);
        }

        const color = this.getColorOfPixel(coords.x, coords.y, image);

        this.pixelStack = new Array();
        this.pixelStack.push(coords);
        this.addPixelToStack(color, image);
    }

    addPixelToStack(color: number[], image: ImageData): void {
        while (this.pixelStack.length !== 0) {
            const currentCoords = this.pixelStack.pop();
            if (!(currentCoords === undefined || !this.shouldReplacePixel(currentCoords, color, image))) {
                this.drawingService.baseCtx.fillRect(currentCoords.x, currentCoords.y, 1, 1);
                this.addRightPixel(currentCoords, color);
                this.addLeftPixel(currentCoords, color);
                this.addTopPixel(currentCoords, color);
                this.addBottomPixel(currentCoords, color);
            }
        }
    }

    addLeftPixel(currentCoords: Vec2, color: number[]): void {
        if (
            currentCoords.x > 0 &&
            this.coordsIsOnCanvas({ x: currentCoords.x - 1, y: currentCoords.y } as Vec2) &&
            !this.added[currentCoords.x - 1][currentCoords.y]
        ) {
            this.pixelStack.push({ x: currentCoords.x - 1, y: currentCoords.y } as Vec2);
            this.added[currentCoords.x - 1][currentCoords.y] = true;
        }
    }

    addRightPixel(currentCoords: Vec2, color: number[]): void {
        if (
            currentCoords.x < this.drawingService.baseCtx.canvas.width &&
            this.coordsIsOnCanvas({ x: currentCoords.x + 1, y: currentCoords.y } as Vec2) &&
            !this.added[currentCoords.x + 1][currentCoords.y]
        ) {
            this.pixelStack.push({ x: currentCoords.x + 1, y: currentCoords.y } as Vec2);
            this.added[currentCoords.x + 1][currentCoords.y] = true;
        }
    }

    addTopPixel(currentCoords: Vec2, color: number[]): void {
        if (
            currentCoords.y < this.drawingService.baseCtx.canvas.height &&
            this.coordsIsOnCanvas({ x: currentCoords.x, y: currentCoords.y + 1 } as Vec2) &&
            !this.added[currentCoords.x][currentCoords.y + 1]
        ) {
            this.pixelStack.push({ x: currentCoords.x, y: currentCoords.y + 1 } as Vec2);
            this.added[currentCoords.x][currentCoords.y + 1] = true;
        }
    }
    addBottomPixel(currentCoords: Vec2, color: number[]): void {
        if (
            currentCoords.y > 0 &&
            this.coordsIsOnCanvas({ x: currentCoords.x, y: currentCoords.y - 1 } as Vec2) &&
            !this.added[currentCoords.x][currentCoords.y - 1]
        ) {
            this.pixelStack.push({ x: currentCoords.x, y: currentCoords.y - 1 } as Vec2);
            this.added[currentCoords.x][currentCoords.y - 1] = true;
        }
    }
    coordsIsOnCanvas(coords: Vec2): boolean {
        return coords.x > 0 && coords.x < this.added.length && coords.y > 0 && coords.y < this.added[0].length;
    }

    getColorOfPixel(x: number, y: number, image: ImageData): number[] {
        const color: number[] = new Array(4);

        color[0] = image.data[(x + y * this.drawingService.canvas.width) * 4];
        color[1] = image.data[(x + y * this.drawingService.canvas.width) * 4 + 1];
        color[2] = image.data[(x + y * this.drawingService.canvas.width) * 4 + 2];
        color[3] = image.data[(x + y * this.drawingService.canvas.width) * 4 + 3];

        return color;
    }

    shouldReplacePixel(coords: Vec2, color: number[], image: ImageData): boolean {
        const currentColor = this.getColorOfPixel(coords.x, coords.y, image);
        let isAcceptable = true;
        for (let i = 0; i < currentColor.length; i++) {
            if (!this.isAcceptableValue(currentColor[i], color[i])) isAcceptable = false;
        }

        return isAcceptable;
    }

    isAcceptableValue(current: number, reference: number): boolean {
        return Math.abs((current - reference) / 255) <= this.tolerance;
    }

    changeAllColors(event: MouseEvent): void {
        const image: ImageData = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        const coords = this.getPositionFromMouse(event);
        const color = this.getColorOfPixel(coords.x, coords.y, image);

        for (let i = 0; i < image.data.length; i += Globals.PIXEL_SIZE) {
            const currentCoords = {
                x: (i / Globals.PIXEL_SIZE) % this.drawingService.baseCtx.canvas.width,
                y: Math.trunc(i / Globals.PIXEL_SIZE / this.drawingService.baseCtx.canvas.width),
            };

            let isAcceptable = true;
            for (let j = 0; j < color.length; j++) {
                if (!this.isAcceptableValue(color[j], image.data[i + j])) {
                    isAcceptable = false;
                }
            }
            if (isAcceptable) {
                this.drawingService.baseCtx.fillRect(currentCoords.x, currentCoords.y, 1, 1);
            }
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown) {
            this.outOfBounds = true;
        }
    }

    onMouseEnter(event: MouseEvent): void {
        this.outOfBounds = false;
    }
}
