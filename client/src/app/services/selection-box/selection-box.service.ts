import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';

@Injectable({
    providedIn: 'root',
})
export class SelectionBoxService {
    private handlersPositions: Vec2[] = [];
    selectionBox: { [key: string]: string };
    cursor: { [key: string]: string };

    // calcul position des 8 handlers
    setHandlersPositions(topLeft: Vec2, width: number, height: number): void {
        const bottomRight = {
            x: topLeft.x + width,
            y: topLeft.y + height,
        };
        this.handlersPositions = [];
        // coin haut gauche
        this.handlersPositions.push(topLeft);
        // centre haut
        this.handlersPositions.push({ x: bottomRight.x - (bottomRight.x - topLeft.x) / 2, y: topLeft.y });
        // coin haut droite
        this.handlersPositions.push({ x: bottomRight.x, y: topLeft.y });
        // centre droite
        this.handlersPositions.push({ x: bottomRight.x, y: bottomRight.y - (bottomRight.y - topLeft.y) / 2 });
        // coin bas droite
        this.handlersPositions.push(bottomRight);
        // centre bas
        this.handlersPositions.push({ x: bottomRight.x - (bottomRight.x - topLeft.x) / 2, y: bottomRight.y });
        // coin bas gauche
        this.handlersPositions.push({ x: topLeft.x, y: bottomRight.y });
        // centre gauche
        this.handlersPositions.push({ x: topLeft.x, y: bottomRight.y - (bottomRight.y - topLeft.y) / 2 });
    }

    getHandlersPositions(): Vec2[] {
        return this.handlersPositions;
    }

    getCursor(pos: number): string {
        if (pos === Globals.TOP_LEFT_HANDLER || pos === Globals.BOTTOM_RIGHT_HANDLER) return 'nw-resize';
        if (pos === Globals.TOP_HANDLER || pos === Globals.BOTTOM_HANDLER) return 'n-resize';
        if (pos === Globals.TOP_RIGHT_HANDLER || pos === Globals.BOTTOM_LEFT_HANDLER) return 'ne-resize';
        if (pos === Globals.RIGHT_HANDLER || pos === Globals.LEFT_HANDLER) return 'e-resize';
        else return 'all-scroll';
    }

    getLeftPosition(pos: number): string {
        return this.handlersPositions[pos].x - Globals.HANDLERS_POSITION + 'px';
    }

    getTopPosition(pos: number): string {
        return this.handlersPositions[pos].y - Globals.HANDLERS_POSITION + 'px';
    }

    drawSelectionBox(topLeft: Vec2, width: number, height: number): void {
        if (width < 0) {
            topLeft.x = topLeft.x + width;
            width = Math.abs(width);
        }
        if (height < 0) {
            topLeft.y = topLeft.y + height;
            height = Math.abs(height);
        }
        this.selectionBox = {
            height: height + 'px',
            width: width + 'px',
            border: '2px solid blue',
            position: 'absolute',
            left: topLeft.x + 'px',
            top: topLeft.y + 'px',
        };
    }

    cursorChange(event: MouseEvent, inSelection: boolean, topLeft: Vec2, width: number, height: number): void {
        if (width < 0) {
            topLeft.x = topLeft.x + width;
            width = Math.abs(width);
        }
        if (height < 0) {
            topLeft.y = topLeft.y + height;
            height = Math.abs(height);
        }
        const bottomRight = {
            x: topLeft.x + width,
            y: topLeft.y + height,
        };
        if (event.offsetX > topLeft.x && event.offsetX < bottomRight.x && event.offsetY > topLeft.y && event.offsetY < bottomRight.y && inSelection) {
            this.cursor = {
                cursor: 'all-scroll',
            };
        } else {
            this.cursor = {
                cursor: 'crosshair',
            };
        }
    }
}
