import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    pile: DrawAction[];
    currentLocation: number = 0;
    constructor() {
        this.pile = [];
    }

    undo(): void {
        // TO-DO
        this.currentLocation--;
    }

    redo(): void {
        // TO-DO
        this.currentLocation++;
    }

    addAction(action: DrawAction): void {
        if (this.currentLocation !== this.pile.length) {
            this.pile = this.pile.slice(0, this.currentLocation);
        }
        this.pile.push(action);
        this.currentLocation++;
    }

    doAction(action: DrawAction): void {}
}

export interface DrawAction {
    tool: string; // Keyshortcut to get tool
    colors: string[]; // Colors at moment of action
    widths: number[]; // List of widths (for aersol: width, radius and sprayAmount)
    points: Vec2[]; // List of relevant points (size may vary)
}
