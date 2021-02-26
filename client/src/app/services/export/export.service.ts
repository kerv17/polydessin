import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
@Injectable({
    providedIn: 'root',
})
export class ExportService {
    constructor(private drawingService: DrawingService) {}

    exportImage(type: string): void {
        const a = document.createElement('a');
        a.href = this.drawingService.canvas.toDataURL(type);
        a.download = 'canvas';
        document.body.appendChild(a);
        a.click();
    }
}
