import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
@Injectable({
    providedIn: 'root',
})
export class ExportService {
    constructor(public drawingService: DrawingService) {}
    showModalExport: boolean = false;

    exportImage(type: string, name: string, filter: string): void {
        if (type != undefined && name != undefined) {
            if (confirm('Êtes-vous sûr de vouloir exporter le dessin')) {
                this.drawingService.baseCtx.filter = filter;
                this.drawingService.baseCtx.drawImage(this.drawingService.canvas, 0, 0);
                const a = document.createElement('a');
                a.href = this.drawingService.canvas.toDataURL('image/' + type);
                a.download = name;
                document.body.appendChild(a);
                a.click();
            }
        } else {
            window.alert('Veuillez entrer un nom et choisir le type de fichier ');
        }
    }
}
