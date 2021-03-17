import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';

@Injectable({
    providedIn: 'root',
})
export class SelectionBoxService {
    handlersPositions: Vec2[] = [];
    handler0: { [key: string]: string };
    handler1: { [key: string]: string };
    handler2: { [key: string]: string };
    handler3: { [key: string]: string };
    handler4: { [key: string]: string };
    handler5: { [key: string]: string };
    handler6: { [key: string]: string };
    handler7: { [key: string]: string };
    selectionBox: { [key: string]: string };
    cursor: { [key: string]: string };

    // calcul position des 8 handlers
    setHandlersPositions(topLeft: Vec2, bottomRight: Vec2): void {
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

    drawHandlers(): void {
        this.handler0 = {
            left: this.handlersPositions[Globals.TOP_LEFT_HANDLER].x - Globals.HANDLERS_POSITION + 'px',
            top: this.handlersPositions[Globals.TOP_LEFT_HANDLER].y - Globals.HANDLERS_POSITION + 'px',
            cursor: 'nw-resize',
        };
        this.handler1 = {
            left: this.handlersPositions[Globals.TOP_HANDLER].x - Globals.HANDLERS_POSITION + 'px',
            top: this.handlersPositions[Globals.TOP_HANDLER].y - Globals.HANDLERS_POSITION + 'px',
            cursor: 'n-resize',
        };
        this.handler2 = {
            left: this.handlersPositions[Globals.TOP_RIGHT_HANDLER].x - Globals.HANDLERS_POSITION + 'px',
            top: this.handlersPositions[Globals.TOP_RIGHT_HANDLER].y - Globals.HANDLERS_POSITION + 'px',
            cursor: 'ne-resize',
        };
        this.handler3 = {
            left: this.handlersPositions[Globals.RIGHT_HANDLER].x - Globals.HANDLERS_POSITION + 'px',
            top: this.handlersPositions[Globals.RIGHT_HANDLER].y - Globals.HANDLERS_POSITION + 'px',
            cursor: 'e-resize',
        };
        this.handler4 = {
            left: this.handlersPositions[Globals.BOTTOM_RIGHT_HANDLER].x - Globals.HANDLERS_POSITION + 'px',
            top: this.handlersPositions[Globals.BOTTOM_RIGHT_HANDLER].y - Globals.HANDLERS_POSITION + 'px',
            cursor: 'nw-resize',
        };
        this.handler5 = {
            left: this.handlersPositions[Globals.BOTTOM_HANDLER].x - Globals.HANDLERS_POSITION + 'px',
            top: this.handlersPositions[Globals.BOTTOM_HANDLER].y - Globals.HANDLERS_POSITION + 'px',
            cursor: 'n-resize',
        };
        this.handler6 = {
            left: this.handlersPositions[Globals.BOTTOM_LEFT_HANDLER].x - Globals.HANDLERS_POSITION + 'px',
            top: this.handlersPositions[Globals.BOTTOM_LEFT_HANDLER].y - Globals.HANDLERS_POSITION + 'px',
            cursor: 'ne-resize',
        };
        this.handler7 = {
            left: this.handlersPositions[Globals.LEFT_HANDLER].x - Globals.HANDLERS_POSITION + 'px',
            top: this.handlersPositions[Globals.LEFT_HANDLER].y - Globals.HANDLERS_POSITION + 'px',
            cursor: 'e-resize',
        };
    }

    drawSelectionBox(topLeft: Vec2, width: number, height: number): void {
        this.selectionBox = {
            height: height + 'px',
            width: width + 'px',
            border: '2px solid blue',
            position: 'absolute',
            left: topLeft.x + 1 + 'px',
            top: topLeft.y + 1 + 'px',
        };
    }

    cursorChange(event: MouseEvent, inSelection: boolean, topLeft: Vec2, bottomRight: Vec2): void {
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
