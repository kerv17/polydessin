import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class AerosolServiceService extends Tool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
    }
}
