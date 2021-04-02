import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ExportService } from '@app/services/export/export.service';

const CONSTANTE_DIVISION_FENETRE = 4;
@Component({
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.scss'],
})
export class ExportComponent implements AfterViewInit {
    @ViewChild('export', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    png: string = 'png';
    jpeg: string = 'jpeg';
    ctx: CanvasRenderingContext2D;
    exportMode: string;
    width: number;
    height: number;
    filtre: string = 'none';
    fileName: string = 'canvas';
    constructor(private exportService: ExportService) {
        this.width = window.innerWidth / CONSTANTE_DIVISION_FENETRE;
        this.height = window.innerHeight / CONSTANTE_DIVISION_FENETRE;
    }

    onResize(): void {
        this.ctx.canvas.height = window.innerHeight / CONSTANTE_DIVISION_FENETRE;
        this.ctx.canvas.width = window.innerWidth / CONSTANTE_DIVISION_FENETRE;
        this.ctx.filter = this.filtre;
        this.ctx.drawImage(this.exportService.drawingService.canvas, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    ngAfterViewInit(): void {
        this.width = window.innerWidth / CONSTANTE_DIVISION_FENETRE;
        this.height = window.innerHeight / CONSTANTE_DIVISION_FENETRE;
        this.ctx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.ctx.drawImage(this.exportService.drawingService.canvas, 0, 0, this.width, this.height);
    }

    toggleMode(mode: string): void {
        this.exportMode = mode;
    }

    setFiltre(buttonfiltre: string): void {
        this.filtre = buttonfiltre;
        this.ctx.filter = this.filtre;
        this.ctx.drawImage(this.exportService.drawingService.canvas, 0, 0, this.width, this.height);
    }

    exportImgur(): void {
        this.exportService.exportToImgur(this.exportMode, this.fileName, this.filtre);
    }

    exportPicture(): void {
        this.exportService.downloadImage(this.exportMode, this.fileName, this.filtre);
    }
    close(): void {
        this.exportService.showModalExport = false;
    }
}
