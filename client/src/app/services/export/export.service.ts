import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ServerRequestService } from '@app/services/server-request/server-request.service';
import { CanvasInformation } from '@common/communication/canvas-information';
@Injectable({
    providedIn: 'root',
})
export class ExportService {
    anchor: HTMLAnchorElement;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    constructor(public drawingService: DrawingService, private serverRequestService: ServerRequestService) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.anchor = document.createElement('a');
    }
    showModalExport: boolean = false;

    setExportCanvas(filter: string): void {
        this.canvas.height = this.drawingService.canvas.height;
        this.canvas.width = this.drawingService.canvas.width;
        this.context.filter = filter;
        this.context.drawImage(this.drawingService.canvas, 0, 0);
    }

    exportToImgur(type: string, name: string, filter: string): void {
        if (!this.createExportImage(type, name, filter)) return;
        const data = this.canvas.toDataURL('image/' + type);

        const info = { name, format: type, imageData: data } as CanvasInformation;

        this.serverRequestService.basicPost(info, 'imgur').subscribe(
            (response) => {
                window.alert("Lien de l'image:" + response.body?.body);
            },
            (err: HttpErrorResponse) => {
                if (err.status === 0) window.alert('Aucune connection avec le serveur');
                else {
                    window.alert(err.error);
                }
            },
        );
    }

    downloadImage(type: string, name: string, filter: string): void {
        if (!this.createExportImage(type, name, filter)) return;
        this.anchor.href = this.canvas.toDataURL('image/' + type);

        this.anchor.download = name;
        document.body.appendChild(this.anchor);
        this.anchor.click();
    }

    createExportImage(type: string, name: string, filter: string): boolean {
        if (type != undefined && this.checkifNotEmpty(name)) {
            if (confirm('Êtes-vous sûr de vouloir exporter le dessin')) {
                this.setExportCanvas(filter);
                return true;
            }
        } else {
            window.alert('Veuillez entrer un nom et choisir le type de fichier ');
        }
        return false;
    }
    checkifNotEmpty(name: string): boolean {
        if (name === '') return false;

        for (const char of name) {
            if (char !== ' ') return true;
        }
        return false;
    }
}
