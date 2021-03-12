import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from './vec2';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;
    outOfBounds: boolean = false;
    color: string;
    color2: string;
    width: number;
    pointWidth: number;
    toolMode: string = 'fill';
    shift: boolean = false;
    protected pathData: Vec2[];

    constructor(protected drawingService: DrawingService) {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    onClick(event: MouseEvent): void {}

    ondbClick(event: MouseEvent): void {}

    onShift(shift: boolean): void {}

    onEscape(): void {}

    onBackspace(): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        let mousePosition = { x: event.offsetX, y: event.offsetY };
        if (this.mouseDown) {
            if (mousePosition.x > this.drawingService.canvas.width && mousePosition.y > this.drawingService.canvas.height) {
                mousePosition = { x: this.drawingService.canvas.width, y: this.drawingService.canvas.height };
            } else if (mousePosition.x > this.drawingService.canvas.width) {
                mousePosition = { x: this.drawingService.canvas.width, y: mousePosition.y };
            } else if (mousePosition.y > this.drawingService.canvas.height) {
                mousePosition = { x: mousePosition.x, y: this.drawingService.canvas.height };
            }
        }
        return mousePosition;
    }

    clearPath(): void {
        this.pathData = [];
    }
}
