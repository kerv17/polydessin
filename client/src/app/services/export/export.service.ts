import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
@Injectable({
    providedIn: 'root',
})
export class ExportService {
    constructor(public drawingService: DrawingService) {}
    showModalExport: boolean = false;

    exportImage(type: string, name: string): void {
        if (type != undefined && this.checkifNotEmpty(name)) {
            if (confirm('Êtes-vous sûr de vouloir exporter le dessin')) {
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
    checkifNotEmpty(name: string): boolean {
        if (name === '') return false;

        for (const char of name) {
            if (char !== ' ') return true;
        }
        return false;
    }
}
