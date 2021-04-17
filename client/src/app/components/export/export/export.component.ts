import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ExportService } from '@app/services/export/export.service';

const WINDOW_DIVISION = 4;
@Component({
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.scss'],
})
export class ExportComponent implements AfterViewInit {
    @ViewChild('export', { static: false })
    previewCanvas: ElementRef<HTMLCanvasElement>;
    png: string = 'png';
    jpeg: string = 'jpeg';
    ctx: CanvasRenderingContext2D;
    exportMode: string;
    width: number;
    height: number;
    filter: string = 'none';
    fileName: string = 'canvas';
    constructor(private exportService: ExportService) {
        this.width = window.innerWidth / WINDOW_DIVISION;
        this.height = window.innerHeight / WINDOW_DIVISION;
    }

    onResize(): void {
        this.ctx.canvas.height = window.innerHeight / WINDOW_DIVISION;
        this.ctx.canvas.width = window.innerWidth / WINDOW_DIVISION;
        this.ctx.filter = this.filter;
        this.ctx.drawImage(this.exportService.drawingService.canvas, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    ngAfterViewInit(): void {
        this.width = window.innerWidth / WINDOW_DIVISION;
        this.height = window.innerHeight / WINDOW_DIVISION;
        this.ctx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.ctx.drawImage(this.exportService.drawingService.canvas, 0, 0, this.width, this.height);
    }

    toggleMode(mode: string): void {
        this.exportMode = mode;
    }

    setFilter(buttonFilter: string): void {
        this.filter = buttonFilter;
        this.ctx.filter = this.filter;
        this.ctx.drawImage(this.exportService.drawingService.canvas, 0, 0, this.width, this.height);
    }

    exportImgur(): void {
        this.exportService.exportToImgur(this.exportMode, this.fileName, this.filter);
    }

    exportPicture(): void {
        this.exportService.downloadImage(this.exportMode, this.fileName, this.filter);
    }
    close(): void {
        this.exportService.showModalExport = false;
    }
}
