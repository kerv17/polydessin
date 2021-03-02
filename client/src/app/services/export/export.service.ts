import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
@Injectable({
    providedIn: 'root',
})
export class ExportService {
    constructor(public drawingService: DrawingService) {}
    showModalExport: boolean = false;

    exportImage(type: string, name: string): void {
        const a = document.createElement('a');
        a.href = this.drawingService.canvas.toDataURL('image/' + type);
        a.download = name;
        document.body.appendChild(a);
        a.click();
    }
}
