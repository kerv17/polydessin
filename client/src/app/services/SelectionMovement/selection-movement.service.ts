import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as Globals from '@app/Constants/constants';

@Injectable({
    providedIn: 'root',
})
export class SelectionMovementService {
    initialMousePosition: Vec2;
    leftArrow: boolean = false;
    downArrow: boolean = false;
    rightArrow: boolean = false;
    upArrow: boolean = false;

    constructor() {}

    onMouseDown(event: MouseEvent, mousePosition: Vec2, topLeft: Vec2, width: number, height: number): boolean {
        const bottomRight = { x: topLeft.x + width, y: topLeft.y + height };
        if (mousePosition.x > topLeft.x && mousePosition.x < bottomRight.x && mousePosition.y > topLeft.y && mousePosition.y < bottomRight.y) {
            this.initialMousePosition = { x: event.x, y: event.y };
            return true;
        } else {
            return false;
        }
    }

    onMouseMove(event: MouseEvent, ctx: CanvasRenderingContext2D, topLeft: Vec2, selectedArea: ImageData): void {
        const deplacement: Vec2 = { x: event.x - this.initialMousePosition.x, y: event.y - this.initialMousePosition.y };
        const position: Vec2 = { x: topLeft.x + deplacement.x, y: topLeft.y + deplacement.y };
        ctx.putImageData(selectedArea, position.x, position.y);
    }

    onMouseUp(event: MouseEvent, topLeft: Vec2): Vec2 {
        const deplacement: Vec2 = { x: event.x - this.initialMousePosition.x, y: event.y - this.initialMousePosition.y };
        const position: Vec2 = { x: topLeft.x + deplacement.x, y: topLeft.y + deplacement.y };
        this.initialMousePosition = { x: 0, y: 0 };
        return position;
    }

    onArrowKeyDown(event: KeyboardEvent, inSelection: boolean): void {
        if (inSelection) {
            if (event.key === 'ArrowLeft') {
                this.leftArrow = true;
            }
            if (event.key === 'ArrowUp') {
                this.upArrow = true;
            }
            if (event.key === 'ArrowRight') {
                this.rightArrow = true;
            }
            if (event.key === 'ArrowDown') {
                this.downArrow = true;
            }
        }
    }

    onArrowKeyUp(event: KeyboardEvent, inSelection: boolean): void {
        if (inSelection) {
            if (event.key === 'ArrowLeft') {
                this.leftArrow = false;
            }
            if (event.key === 'ArrowUp') {
                this.upArrow = false;
            }
            if (event.key === 'ArrowRight') {
                this.rightArrow = false;
            }
            if (event.key === 'ArrowDown') {
                this.downArrow = false;
            }
        }
    }

    moveSelection(topLeft: Vec2): Vec2 {
        if (this.leftArrow) {
            topLeft.x -= Globals.N_PIXELS_DEPLACEMENT;
        }
        if (this.upArrow) {
            topLeft.y -= Globals.N_PIXELS_DEPLACEMENT;
        }
        if (this.rightArrow) {
            topLeft.x += Globals.N_PIXELS_DEPLACEMENT;
        }
        if (this.downArrow) {
            topLeft.y += Globals.N_PIXELS_DEPLACEMENT;
        }
        return topLeft;
    }

    /*arrowKeySelected(): boolean {
        if (this.leftArrow || this.upArrow || this.rightArrow || this.downArrow) {
            return true;
        }
        return false;
    }

    getKey(): string {
        if (this.leftArrow) {
            return 'ArrowLeft';
        }
        if (this.upArrow) {
            return 'ArrowUp';
        }
        if (this.rightArrow) {
            return 'ArrowRight';
        }
        if (this.downArrow) {
            return 'ArrowDown';
        }
        return '';
    }*/
}
