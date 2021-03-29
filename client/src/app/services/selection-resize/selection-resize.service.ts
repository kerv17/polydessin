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
                mousePosition.x <= handlers.x + 5 &&
                mousePosition.x >= handlers.x - 5 &&
                mousePosition.y <= handlers.y + 5 &&
                mousePosition.y >= handlers.y - 5
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
            } else if (height < 0) {
                ctx.scale(1, -1);
                ctx.drawImage(imgBitmap, path[0].x, -path[0].y, width, -height);
            } else {
                ctx.drawImage(imgBitmap, path[0].x, path[0].y, width, height);
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        });
    }

    // resize après déplacement fail parce que calculée à partir de pathData[0] qui n'est plus l'actual position
    // possibilité recalculer le path avant de le passer pathData[0] devient le pathData[4] et les autres sont caluclés
    // selon width et height, ajouter une fonction pour faire ça avant l'itération si pathData[4] != pathData[0], donc
    // si il y a eu un déplacement de la sélection sur la surface de dessin
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

    // implémenter le flip
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
