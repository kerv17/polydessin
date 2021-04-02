import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DrawAction } from '@app/services/tools/undoRedo/undo-redo.service';
import { Vec2 } from './vec2';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;
    outOfBounds: boolean = false;
    color: string;
    color2: string;
    width: number = 1;
    pointWidth: number;
    toolMode: string = 'fill';
    shift: boolean = false;
    protected pathData: Vec2[];

    constructor(public drawingService: DrawingService) {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    onClick(event: MouseEvent): void {}

    ondbClick(event: MouseEvent): void {}

    onShift(shift: boolean): void {}

    onEscape(): void {}

    onWheel(event: WheelEvent): void {}

    onBackspace(): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.pageX - Globals.SIDEBAR_WIDTH, y: event.pageY };
    }

    clearPath(): void {
        this.pathData = [];
    }

    clearPreviewCtx(): void {
        if (this.drawingService.previewCtx != undefined) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.previewCtx.beginPath();
        }
    }

    doAction(action: DrawAction): void {}

    protected saveSetting(): Setting {
        const setting: Setting = {
            mouseDownCoord: this.mouseDownCoord,
            mouseDown: this.mouseDown,
            outOfBounds: this.outOfBounds,
            color: this.color,
            color2: this.color2,
            width: this.width,
            pointWidth: this.pointWidth,
            toolMode: this.toolMode,
            shift: this.shift,
            pathData: this.pathData,
        };
        return setting;
    }

    protected loadSetting(setting: Setting): void {
        this.mouseDownCoord = setting.mouseDownCoord;
        this.mouseDown = setting.mouseDown;
        this.outOfBounds = setting.outOfBounds;
        this.color = setting.color;
        this.color2 = setting.color2;
        this.width = setting.width;
        this.pointWidth = setting.pointWidth;
        this.toolMode = setting.toolMode;
        this.shift = setting.shift;
        this.pathData = setting.pathData;
    }

    protected createAction(): DrawAction {
        const drawAction: DrawAction = {
            type: 'Draw',
            tool: this as Tool,
            setting: this.saveSetting(),
            canvas: this.drawingService.baseCtx,
        };
        return drawAction;
    }

    protected dispatchAction(action: DrawAction): void {
        const c: CustomEvent = new CustomEvent('action', { detail: action });
        dispatchEvent(c);
    }
}

export interface Setting {
    mouseDownCoord: Vec2;
    mouseDown: boolean;
    outOfBounds: boolean;
    color: string;
    color2: string;
    width: number;
    pointWidth: number;
    toolMode: string;
    shift: boolean;
    pathData: Vec2[];
}
