import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
@Injectable({
    providedIn: 'root',
})
export class ExportService {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    constructor(public drawingService: DrawingService) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }
    showModalExport: boolean = false;

    exportImage(type: string, name: string, filtre: string): void {
        if (type != undefined && this.checkifNotEmpty(name)) {
            if (confirm('Êtes-vous sûr de vouloir exporter le dessin')) {
                this.canvas.height = this.drawingService.canvas.height;
                this.canvas.width = this.drawingService.canvas.width;
                this.context.filter = filtre;
                this.context.drawImage(this.drawingService.canvas, 0, 0);

                const a = document.createElement('a');
                a.href = this.canvas.toDataURL('image/' + type);
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
