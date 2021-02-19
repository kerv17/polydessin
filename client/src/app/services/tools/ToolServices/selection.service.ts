import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionService extends Tool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.width = 1;
    }

    // on mouse up

    // on mouse move

    // on mouse down

    // shift

    // on escape

    // selectionner tout le canvas avec Ctrl + A

    // draw border

    // getrectanglepoints 8 pts
}
