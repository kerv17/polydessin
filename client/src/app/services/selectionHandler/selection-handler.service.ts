import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class SelectionHandlerService {
    constructor() {}
    // position des 8 handlers
    handlersPositions: Vec2[] = [];

    // boolean pour savoir lequel est cliqué
    clickedElement: boolean[] = [false, false, false, false, false, false, false, false];

    // fonction de vérif pour savoir où est survenu le clic de la souris
    handlerWasClicked(mousePosition: Vec2): boolean {
        if (this.handlersPositions.length > 0) {
            for (let pos = 0; pos < this.handlersPositions.length; pos++) {
                if (this.handlersPositions[pos].x === mousePosition.x && this.handlersPositions[pos].y === mousePosition.y) {
                    this.clickedElement[pos] = true;
                    return true;
                }
            }
        }

        return false;
    }

    // à changer pour utiliser le vecteur des handlers
    movementSelected(mousePosition: Vec2, topLeft: Vec2, bottomRight: Vec2): boolean {
        if (mousePosition.x > topLeft.x && mousePosition.x < bottomRight.x && mousePosition.y > topLeft.y && mousePosition.y < bottomRight.y) {
            return true;
        }
        return false;
    }

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

    /* resizeSelectionBox(mousePosition: Vec2, topLeft: Vec2): void {
        let width: number;
        let height: number;

        if (this.clickedElement[0]) {
        }
        if (this.clickedElement[1]) {
        }
        if (this.clickedElement[2]) {
        }
        if (this.clickedElement[3]) {
        }
        if (this.clickedElement[4]) {
            width = mousePosition.x - topLeft.x;
            height = mousePosition.y - topLeft.y;
        }
        if (this.clickedElement[5]) {
        }
        if (this.clickedElement[6]) {
        }
        if (this.clickedElement[7]) {
        }
    }*/
}
