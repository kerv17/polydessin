import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
@Injectable({
    providedIn: 'root',
})
export class ExportService {
    constructor(public drawingService: DrawingService) {}
    showModalExport: boolean = false;

    exportImage(type: string, name: string, filtre: string): void {
        if (type != undefined && this.checkifNotEmpty(name)) {
            if (confirm('Êtes-vous sûr de vouloir exporter le dessin')) {
                const canvas: HTMLCanvasElement = document.createElement('canvas');
                const context = canvas.getContext('2d') as CanvasRenderingContext2D;
                canvas.height = this.drawingService.canvas.height;
                canvas.width = this.drawingService.canvas.width;
                context.filter = filtre;
                context.drawImage(this.drawingService.canvas, 0, 0);

                const a = document.createElement('a');
                a.href = canvas.toDataURL('image/' + type);
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
