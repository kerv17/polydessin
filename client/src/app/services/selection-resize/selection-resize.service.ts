import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { SelectionBoxService } from '@app/services/selection-box/selection-box.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionResizeService {
    private positions: Vec2[];
    private actualHandler: number;
    private resizePathData: Vec2[] = [];
    private hasResized: boolean = false;
    private resizeMap: Map<number, (mousePosition: Vec2, shifted: boolean) => void> = new Map();

    constructor(private selectionBox: SelectionBoxService) {
        this.initMap();
    }

    initializePath(path: Vec2[]): void {
        if (this.resizePathData.length === 0) {
            for (const position of path) {
                this.resizePathData.push({ x: position.x, y: position.y });
            }
            if (this.resizePathData.length < 4) {
                this.resizePathData.push({ x: path[0].x, y: path[0].y });
            }
        }
    }

    resetPath(): void {
        this.resizePathData = [];
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
    onMouseDown(mousePosition: Vec2): boolean {
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
        this.resizeMap.get(this.actualHandler)?.call(this, mousePosition, shifted);
        this.resizePathData[4] = { x: this.resizePathData[0].x, y: this.resizePathData[0].y };
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

    onMouseUp(): boolean {
        if (this.hasResized) {
            this.updatePathData();
        }
        return this.hasResized;
    }

    setPathDataAfterMovement(path: Vec2): void {
        if (this.resizePathData.length !== 0 && path !== this.resizePathData[4]) {
            this.resizePathData[4] = { x: path.x, y: path.y };
            this.updatePathData();
        }
    }

    private updatePathData(): void {
        const width = Math.abs(this.resizePathData[2].x - this.resizePathData[0].x);
        const height = Math.abs(this.resizePathData[2].y - this.resizePathData[0].y);
        this.resizePathData[0] = { x: this.resizePathData[4].x, y: this.resizePathData[4].y };
        this.resizePathData[1] = { x: this.resizePathData[4].x, y: this.resizePathData[4].y + height };
        this.resizePathData[2] = { x: this.resizePathData[4].x + width, y: this.resizePathData[4].y + height };
        this.resizePathData[3] = { x: this.resizePathData[4].x + width, y: this.resizePathData[4].y };
    }

    private initMap(): void {
        this.resizeMap
            .set(0, this.resizeHandler0)
            .set(1, this.resizeHandler1)
            .set(2, this.resizeHandler2)
            .set(3, this.resizeHandler3)
            .set(4, this.resizeHandler4)
            .set(5, this.resizeHandler5)
            .set(6, this.resizeHandler6)
            .set(7, this.resizeHandler7);
    }

    private resizeHandler0(mousePosition: Vec2, shifted: boolean): void {
        if (shifted) {
            this.resizePathData[0] = { x: this.resizePathData[1].x - (this.resizePathData[3].y - mousePosition.y), y: mousePosition.y };
            this.resizePathData[1] = { x: this.resizePathData[0].x, y: this.resizePathData[2].y };
            this.resizePathData[3] = { x: this.resizePathData[2].x, y: mousePosition.y };
        } else {
            this.resizePathData[0] = mousePosition;
            this.resizePathData[3].y = mousePosition.y;
            this.resizePathData[1].x = mousePosition.x;
        }
    }

    private resizeHandler1(mousePosition: Vec2, shifted: boolean): void {
        this.resizePathData[0].y = mousePosition.y;
        this.resizePathData[3].y = mousePosition.y;
    }

    private resizeHandler2(mousePosition: Vec2, shifted: boolean): void {
        if (shifted) {
            this.resizePathData[3] = { x: this.resizePathData[2].x + this.resizePathData[0].y - mousePosition.y, y: mousePosition.y };
            this.resizePathData[2] = { x: this.resizePathData[3].x, y: this.resizePathData[1].y };
            this.resizePathData[0] = { x: this.resizePathData[1].x, y: mousePosition.y };
        } else {
            this.resizePathData[3] = mousePosition;
            this.resizePathData[0].y = mousePosition.y;
            this.resizePathData[2].x = mousePosition.x;
        }
    }

    private resizeHandler3(mousePosition: Vec2, shifted: boolean): void {
        this.resizePathData[3].x = mousePosition.x;
        this.resizePathData[2].x = mousePosition.x;
    }

    private resizeHandler4(mousePosition: Vec2, shifted: boolean): void {
        if (shifted) {
            this.resizePathData[2] = { x: this.resizePathData[3].x + mousePosition.y - this.resizePathData[1].y, y: mousePosition.y };
            this.resizePathData[1] = { x: this.resizePathData[1].x, y: mousePosition.y };
            this.resizePathData[3] = { x: this.resizePathData[2].x, y: this.resizePathData[3].y };
        } else {
            this.resizePathData[2] = mousePosition;
            this.resizePathData[3].x = mousePosition.x;
            this.resizePathData[1].y = mousePosition.y;
        }
    }

    private resizeHandler5(mousePosition: Vec2, shifted: boolean): void {
        this.resizePathData[2].y = mousePosition.y;
        this.resizePathData[1].y = mousePosition.y;
    }

    private resizeHandler6(mousePosition: Vec2, shifted: boolean): void {
        if (shifted) {
            this.resizePathData[1] = { x: this.resizePathData[0].x - (mousePosition.y - this.resizePathData[2].y), y: mousePosition.y };
            this.resizePathData[2] = { x: this.resizePathData[3].x, y: mousePosition.y };
            this.resizePathData[0] = { x: this.resizePathData[1].x, y: this.resizePathData[3].y };
        } else {
            this.resizePathData[1] = mousePosition;
            this.resizePathData[0].x = mousePosition.x;
            this.resizePathData[2].y = mousePosition.y;
        }
    }

    private resizeHandler7(mousePosition: Vec2, shifted: boolean): void {
        this.resizePathData[0].x = mousePosition.x;
        this.resizePathData[1].x = mousePosition.x;
    }
}
