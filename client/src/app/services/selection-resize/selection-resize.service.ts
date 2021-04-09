import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';
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
            if (this.resizePathData.length <= Globals.CURRENT_SELECTION_POSITION) {
                this.resizePathData.push({ x: path[0].x, y: path[0].y });
            }
        }
    }

    resetPath(): void {
        this.resizePathData = [];
    }

    getActualResizedPosition(): Vec2 {
        return this.resizePathData[Globals.CURRENT_SELECTION_POSITION];
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
                mousePosition.x <= handlers.x + Globals.HANDLERS_WIDTH &&
                mousePosition.x >= handlers.x - Globals.HANDLERS_WIDTH &&
                mousePosition.y <= handlers.y + Globals.HANDLERS_WIDTH &&
                mousePosition.y >= handlers.y - Globals.HANDLERS_WIDTH
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
        this.resizePathData[Globals.CURRENT_SELECTION_POSITION] = { x: this.resizePathData[0].x, y: this.resizePathData[0].y };
        createImageBitmap(selectedArea).then((imgBitmap: ImageBitmap) => {
            this.resizeImage(ctx, imgBitmap);
        });
    }

    onMouseUp(): boolean {
        if (this.hasResized) {
            this.updatePathData();
        }
        return this.hasResized;
    }

    setPathDataAfterMovement(path: Vec2): void {
        if (this.resizePathData.length !== 0 && path !== this.resizePathData[Globals.CURRENT_SELECTION_POSITION]) {
            this.resizePathData[Globals.CURRENT_SELECTION_POSITION] = { x: path.x, y: path.y };
            this.updatePathData();
        }
    }

    private resizeImage(ctx: CanvasRenderingContext2D, imgBitmap: ImageBitmap): void {
        const width = this.resizePathData[2].x - this.resizePathData[0].x;
        const height = this.resizePathData[2].y - this.resizePathData[0].y;

        if (width < 0 && height < 0) {
            ctx.scale(Globals.MIRROR_SCALE, Globals.MIRROR_SCALE);
            ctx.drawImage(imgBitmap, -this.resizePathData[0].x, -this.resizePathData[0].y, -width, -height);
            this.resizePathData[Globals.CURRENT_SELECTION_POSITION] = { x: this.resizePathData[2].x, y: this.resizePathData[2].y };
        } else if (width < 0) {
            ctx.scale(Globals.MIRROR_SCALE, 1);
            ctx.drawImage(imgBitmap, -this.resizePathData[0].x, this.resizePathData[0].y, -width, height);
            this.resizePathData[Globals.CURRENT_SELECTION_POSITION] = {
                x: this.resizePathData[Globals.RIGHT_HANDLER].x,
                y: this.resizePathData[Globals.RIGHT_HANDLER].y,
            };
        } else if (height < 0) {
            ctx.scale(1, Globals.MIRROR_SCALE);
            ctx.drawImage(imgBitmap, this.resizePathData[0].x, -this.resizePathData[0].y, width, -height);
            this.resizePathData[Globals.CURRENT_SELECTION_POSITION] = { x: this.resizePathData[1].x, y: this.resizePathData[1].y };
        } else {
            ctx.drawImage(imgBitmap, this.resizePathData[0].x, this.resizePathData[0].y, width, height);
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    private updatePathData(): void {
        const width = Math.abs(this.resizePathData[2].x - this.resizePathData[0].x);
        const height = Math.abs(this.resizePathData[2].y - this.resizePathData[0].y);
        this.resizePathData[0] = {
            x: this.resizePathData[Globals.CURRENT_SELECTION_POSITION].x,
            y: this.resizePathData[Globals.CURRENT_SELECTION_POSITION].y,
        };
        this.resizePathData[1] = {
            x: this.resizePathData[Globals.CURRENT_SELECTION_POSITION].x,
            y: this.resizePathData[Globals.CURRENT_SELECTION_POSITION].y + height,
        };
        this.resizePathData[2] = {
            x: this.resizePathData[Globals.CURRENT_SELECTION_POSITION].x + width,
            y: this.resizePathData[Globals.CURRENT_SELECTION_POSITION].y + height,
        };
        this.resizePathData[Globals.RIGHT_HANDLER] = {
            x: this.resizePathData[Globals.CURRENT_SELECTION_POSITION].x + width,
            y: this.resizePathData[Globals.CURRENT_SELECTION_POSITION].y,
        };
    }

    private initMap(): void {
        this.resizeMap
            .set(Globals.TOP_LEFT_HANDLER, this.resizeHandler0)
            .set(Globals.TOP_HANDLER, this.resizeHandler1)
            .set(Globals.TOP_RIGHT_HANDLER, this.resizeHandler2)
            .set(Globals.RIGHT_HANDLER, this.resizeHandler3)
            .set(Globals.CURRENT_SELECTION_POSITION, this.resizeHandler4)
            .set(Globals.BOTTOM_HANDLER, this.resizeHandler5)
            .set(Globals.BOTTOM_LEFT_HANDLER, this.resizeHandler6)
            .set(Globals.LEFT_HANDLER, this.resizeHandler7);
    }

    private resizeHandler0(mousePosition: Vec2, shifted: boolean): void {
        if (shifted) {
            this.resizePathData[0] = {
                x: this.resizePathData[1].x - (this.resizePathData[Globals.RIGHT_HANDLER].y - mousePosition.y),
                y: mousePosition.y,
            };
            this.resizePathData[1] = { x: this.resizePathData[0].x, y: this.resizePathData[2].y };
            this.resizePathData[Globals.RIGHT_HANDLER] = { x: this.resizePathData[2].x, y: mousePosition.y };
        } else {
            this.resizePathData[0] = mousePosition;
            this.resizePathData[Globals.RIGHT_HANDLER].y = mousePosition.y;
            this.resizePathData[1].x = mousePosition.x;
        }
    }

    private resizeHandler1(mousePosition: Vec2, shifted: boolean): void {
        this.resizePathData[0].y = mousePosition.y;
        this.resizePathData[Globals.RIGHT_HANDLER].y = mousePosition.y;
    }

    private resizeHandler2(mousePosition: Vec2, shifted: boolean): void {
        if (shifted) {
            this.resizePathData[Globals.RIGHT_HANDLER] = {
                x: this.resizePathData[2].x + this.resizePathData[0].y - mousePosition.y,
                y: mousePosition.y,
            };
            this.resizePathData[2] = { x: this.resizePathData[Globals.RIGHT_HANDLER].x, y: this.resizePathData[1].y };
            this.resizePathData[0] = { x: this.resizePathData[1].x, y: mousePosition.y };
        } else {
            this.resizePathData[Globals.RIGHT_HANDLER] = mousePosition;
            this.resizePathData[0].y = mousePosition.y;
            this.resizePathData[2].x = mousePosition.x;
        }
    }

    private resizeHandler3(mousePosition: Vec2, shifted: boolean): void {
        this.resizePathData[Globals.RIGHT_HANDLER].x = mousePosition.x;
        this.resizePathData[2].x = mousePosition.x;
    }

    private resizeHandler4(mousePosition: Vec2, shifted: boolean): void {
        if (shifted) {
            this.resizePathData[2] = {
                x: this.resizePathData[Globals.RIGHT_HANDLER].x + mousePosition.y - this.resizePathData[1].y,
                y: mousePosition.y,
            };
            this.resizePathData[1] = { x: this.resizePathData[1].x, y: mousePosition.y };
            this.resizePathData[Globals.RIGHT_HANDLER] = { x: this.resizePathData[2].x, y: this.resizePathData[Globals.RIGHT_HANDLER].y };
        } else {
            this.resizePathData[2] = mousePosition;
            this.resizePathData[Globals.RIGHT_HANDLER].x = mousePosition.x;
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
            this.resizePathData[2] = { x: this.resizePathData[Globals.RIGHT_HANDLER].x, y: mousePosition.y };
            this.resizePathData[0] = { x: this.resizePathData[1].x, y: this.resizePathData[Globals.RIGHT_HANDLER].y };
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
