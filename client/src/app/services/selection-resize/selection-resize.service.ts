import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { SelectionBoxService } from '../selection-box/selection-box.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionResizeService {
    private positions: Vec2[];
    actualHandler: number;
    resizePathData: Vec2[] = [];
    hasResized: boolean = false;

    constructor(private selectionBox: SelectionBoxService) {}

    initializePath(path: Vec2[]): void {
        if (this.resizePathData.length === 0) {
            for (let i = 0; i < path.length; i++) {
                this.resizePathData.push({ x: path[i].x, y: path[i].y });
            }
            if (this.resizePathData.length < 4) {
                this.resizePathData.push({ x: path[0].x, y: path[0].y });
            }
        }
    }

    getActualResizedPosition(): Vec2 {
        return this.resizePathData[4];
    }

    getActualResizedWidth(): number {
        return Math.abs(this.resizePathData[2].x - this.resizePathData[0].x);
    }

    getActualResizedHeight(): number {
        return Math.abs(this.resizePathData[2].y - this.resizePathData[0].y);
    }

    // vérifier si un des 8 handlers a été cliqué
    onMouseDown(mousePosition: Vec2, path: Vec2[]): boolean {
        this.positions = this.selectionBox.getHandlersPositions();
        for (const handlers of this.positions) {
            if (
                mousePosition.x <= handlers.x + 10 &&
                mousePosition.x >= handlers.x - 10 &&
                mousePosition.y <= handlers.y + 10 &&
                mousePosition.y >= handlers.y - 10
            ) {
                this.actualHandler = this.positions.indexOf(handlers);
                return true;
            }
        }
        return false;
    }

    // changer la taille du image data
    onMouseMove(selectedArea: ImageData, ctx: CanvasRenderingContext2D, mousePosition: Vec2, shifted: boolean): void {
        this.hasResized = true;
        this.updatePathDataOnResize(mousePosition, shifted);
        createImageBitmap(selectedArea).then((imgBitmap: ImageBitmap) => {
            const width = this.resizePathData[2].x - this.resizePathData[0].x;
            const height = this.resizePathData[2].y - this.resizePathData[0].y;

            if (width < 0 && height < 0) {
                ctx.scale(-1, -1);
                ctx.drawImage(imgBitmap, -this.resizePathData[0].x, -this.resizePathData[0].y, -width, -height);
                this.resizePathData[4] = { x: this.resizePathData[2].x, y: this.resizePathData[2].y };
            } else if (width < 0) {
                ctx.scale(-1, 1);
                ctx.drawImage(imgBitmap, -this.resizePathData[0].x, this.resizePathData[0].y, -width, height);
                this.resizePathData[4] = { x: this.resizePathData[3].x, y: this.resizePathData[3].y };
            } else if (height < 0) {
                ctx.scale(1, -1);
                ctx.drawImage(imgBitmap, this.resizePathData[0].x, -this.resizePathData[0].y, width, -height);
                this.resizePathData[4] = { x: this.resizePathData[1].x, y: this.resizePathData[1].y };
            } else if (width > 0 && height > 0) {
                ctx.drawImage(imgBitmap, this.resizePathData[0].x, this.resizePathData[0].y, width, height);
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        });
    }

    onMouseUp(): void {
        const width = Math.abs(this.resizePathData[2].x - this.resizePathData[0].x);
        const height = Math.abs(this.resizePathData[2].y - this.resizePathData[0].y);
        this.resizePathData[0] = { x: this.resizePathData[4].x, y: this.resizePathData[4].y };
        this.resizePathData[1] = { x: this.resizePathData[4].x, y: this.resizePathData[4].y + height };
        this.resizePathData[2] = { x: this.resizePathData[4].x + width, y: this.resizePathData[4].y + height };
        this.resizePathData[3] = { x: this.resizePathData[4].x + width, y: this.resizePathData[4].y };
    }

    getPathDataAfterMovement(path: Vec2): void {
        if (this.resizePathData.length !== 0 && path !== this.resizePathData[4]) {
            const width = Math.abs(this.resizePathData[2].x - this.resizePathData[0].x);
            const height = Math.abs(this.resizePathData[2].y - this.resizePathData[0].y);
            this.resizePathData[4] = { x: path.x, y: path.y };
            this.resizePathData[0] = { x: this.resizePathData[4].x, y: this.resizePathData[4].y };
            this.resizePathData[1] = { x: this.resizePathData[4].x, y: this.resizePathData[4].y + height };
            this.resizePathData[2] = { x: this.resizePathData[4].x + width, y: this.resizePathData[4].y + height };
            this.resizePathData[3] = { x: this.resizePathData[4].x + width, y: this.resizePathData[4].y };
        }
    }

    updatePathDataOnResize(mousePosition: Vec2, shifted: boolean): void {
        switch (this.actualHandler) {
            case 0:
                if (shifted) {
                    this.resizePathData[0] = { x: this.resizePathData[1].x - (this.resizePathData[3].y - mousePosition.y), y: mousePosition.y };
                    this.resizePathData[1] = { x: this.resizePathData[0].x, y: this.resizePathData[2].y };
                    this.resizePathData[3] = { x: this.resizePathData[2].x, y: mousePosition.y };
                } else {
                    this.resizePathData[0] = mousePosition;
                    this.resizePathData[3].y = mousePosition.y;
                    this.resizePathData[1].x = mousePosition.x;
                }
                break;
            case 1:
                this.resizePathData[0].y = mousePosition.y;
                this.resizePathData[3].y = mousePosition.y;
                break;
            case 2:
                if (shifted) {
                    this.resizePathData[3] = { x: this.resizePathData[2].x + this.resizePathData[0].y - mousePosition.y, y: mousePosition.y };
                    this.resizePathData[2] = { x: this.resizePathData[3].x, y: this.resizePathData[1].y };
                    this.resizePathData[0] = { x: this.resizePathData[1].x, y: mousePosition.y };
                } else {
                    this.resizePathData[3] = mousePosition;
                    this.resizePathData[0].y = mousePosition.y;
                    this.resizePathData[2].x = mousePosition.x;
                }
                break;
            case 3:
                this.resizePathData[3].x = mousePosition.x;
                this.resizePathData[2].x = mousePosition.x;
                break;
            case 4:
                if (shifted) {
                    this.resizePathData[2] = { x: this.resizePathData[3].x + mousePosition.y - this.resizePathData[1].y, y: mousePosition.y };
                    this.resizePathData[1] = { x: this.resizePathData[1].x, y: mousePosition.y };
                    this.resizePathData[3] = { x: this.resizePathData[2].x, y: this.resizePathData[3].y };
                } else {
                    this.resizePathData[2] = mousePosition;
                    this.resizePathData[3].x = mousePosition.x;
                    this.resizePathData[1].y = mousePosition.y;
                }
                break;
            case 5:
                this.resizePathData[2].y = mousePosition.y;
                this.resizePathData[1].y = mousePosition.y;
                break;
            case 6:
                if (shifted) {
                    this.resizePathData[1] = { x: this.resizePathData[0].x - (mousePosition.y - this.resizePathData[2].y), y: mousePosition.y };
                    this.resizePathData[2] = { x: this.resizePathData[3].x, y: mousePosition.y };
                    this.resizePathData[0] = { x: this.resizePathData[1].x, y: this.resizePathData[3].y };
                } else {
                    this.resizePathData[1] = mousePosition;
                    this.resizePathData[0].x = mousePosition.x;
                    this.resizePathData[2].y = mousePosition.y;
                }
                break;
            case 7:
                this.resizePathData[0].x = mousePosition.x;
                this.resizePathData[1].x = mousePosition.x;
                break;
            default:
                break;
        }
        this.resizePathData[4] = { x: this.resizePathData[0].x, y: this.resizePathData[0].y };
    }
}
