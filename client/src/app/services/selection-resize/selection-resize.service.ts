import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { SelectionBoxService } from '../selection-box/selection-box.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionResizeService {
    private positions: Vec2[];
    actualHandler: number;

    constructor(private selectionBox: SelectionBoxService) {}

    // vérifier si un des 8 handlers a été cliqué
    onMouseDown(mousePosition: Vec2): boolean {
        this.positions = this.selectionBox.getHandlersPositions();
        for (const handlers of this.positions) {
            if (
                mousePosition.x <= handlers.x + 8 &&
                mousePosition.x >= handlers.x - 8 &&
                mousePosition.y <= handlers.y + 8 &&
                mousePosition.y >= handlers.y - 8
            ) {
                this.actualHandler = this.positions.indexOf(handlers);
                return true;
            }
        }
        return false;
    }

    // changer la taille du image data
    onMouseMove(selectedArea: ImageData, ctx: CanvasRenderingContext2D, path: Vec2[], mousePosition: Vec2, shifted: boolean): void {
        this.getPathDataAfterMovement(path);
        this.updatePathDataOnResize(path, mousePosition, shifted);
        createImageBitmap(selectedArea).then(function (imgBitmap) {
            const width = path[2].x - path[0].x;
            const height = path[2].y - path[0].y;
            if (width < 0) {
                ctx.scale(-1, 1);
                ctx.drawImage(imgBitmap, -path[0].x, path[0].y, -width, height);
                // update le pathdata
                // inverser 0 et 3, 2 et 1
                /*
                path[0] = { x: path[3].x, y: path[3].y };
                path[3] = { x: path[4].x, y: path[4].y };
                const temp = { x: path[1].x, y: path[1].y };
                path[1] = { x: path[2].x, y: path[2].y };
                path[2] = { x: temp.x, y: temp.y };
                path[4] = path[0];*/
            } else if (height < 0) {
                ctx.scale(1, -1);
                ctx.drawImage(imgBitmap, path[0].x, -path[0].y, width, -height);
                // update le pathdata
                // inverser 0 et 1, 2 et 3
                /*path[0] = { x: path[1].x, y: path[1].y };
                path[1] = { x: path[4].x, y: path[4].y };
                const temp = { x: path[3].x, y: path[3].y };
                path[3] = { x: path[2].x, y: path[2].y };
                path[2] = { x: temp.x, y: temp.y };*/
            } else {
                ctx.drawImage(imgBitmap, path[0].x, path[0].y, width, height);
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        });
    }

    getPathDataAfterMovement(path: Vec2[]): void {
        if (path[4] !== path[0]) {
            const width = path[2].x - path[0].x;
            const height = path[2].y - path[0].y;
            path[0] = { x: path[4].x, y: path[4].y };
            path[1] = { x: path[4].x, y: path[4].y + height };
            path[2] = { x: path[4].x + width, y: path[4].y + height };
            path[3] = { x: path[4].x + width, y: path[4].y };
        }
    }

    updatePathDataOnResize(path: Vec2[], mousePosition: Vec2, shifted: boolean): void {
        switch (this.actualHandler) {
            case 0:
                if (shifted) {
                    path[0] = { x: path[1].x - (path[3].y - mousePosition.y), y: mousePosition.y };
                    path[1] = { x: path[0].x, y: path[2].y };
                    path[3] = { x: path[2].x, y: mousePosition.y };
                } else {
                    path[0] = mousePosition;
                    path[3].y = mousePosition.y;
                    path[1].x = mousePosition.x;
                }
                break;
            case 1:
                path[0].y = mousePosition.y;
                path[3].y = mousePosition.y;
                break;
            case 2:
                if (shifted) {
                    path[3] = { x: path[2].x + path[0].y - mousePosition.y, y: mousePosition.y };
                    path[2] = { x: path[3].x, y: path[1].y };
                    path[0] = { x: path[1].x, y: mousePosition.y };
                } else {
                    path[3] = mousePosition;
                    path[0].y = mousePosition.y;
                    path[2].x = mousePosition.x;
                }
                break;
            case 3:
                path[3].x = mousePosition.x;
                path[2].x = mousePosition.x;
                break;
            case 4:
                if (shifted) {
                    path[2] = { x: path[3].x + mousePosition.y - path[1].y, y: mousePosition.y };
                    path[1] = { x: path[1].x, y: mousePosition.y };
                    path[3] = { x: path[2].x, y: path[3].y };
                } else {
                    path[2] = mousePosition;
                    path[3].x = mousePosition.x;
                    path[1].y = mousePosition.y;
                }
                break;
            case 5:
                path[2].y = mousePosition.y;
                path[1].y = mousePosition.y;
                break;
            case 6:
                if (shifted) {
                    path[1] = { x: path[0].x - (mousePosition.y - path[2].y), y: mousePosition.y };
                    path[2] = { x: path[3].x, y: mousePosition.y };
                    path[0] = { x: path[1].x, y: path[3].y };
                } else {
                    path[1] = mousePosition;
                    path[0].x = mousePosition.x;
                    path[2].y = mousePosition.y;
                }
                break;
            case 7:
                path[0].x = mousePosition.x;
                path[1].x = mousePosition.x;
                break;
            default:
                break;
        }
        path[4] = path[0];
    }
}
