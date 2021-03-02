import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ExportService } from '@app/services/export/export.service';

@Component({
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.scss'],
})
export class ExportComponent implements AfterViewInit {
    @ViewChild('export', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D;
    constructor(private exportService: ExportService) {
        this.width = window.innerWidth / 4;
        this.height = window.innerHeight / 4;
    }
    private exportMode: string;
    width: number;
    height: number;

    fileName: string;

    ngAfterViewInit() {
        window.alert(this.height);
        this.ctx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        // this.exportService.drawingService.baseCtx.scale(
        //     this.width / this.exportService.drawingService.canvas.width,
        //    this.height / this.exportService.drawingService.canvas.height,
        // );
        this.ctx.drawImage(this.exportService.drawingService.canvas, 0, 0, this.width, this.height);
    }
    togglePng(): void {
        this.exportMode = 'png';
    }

    toggleJpg(): void {
        this.exportMode = 'jpeg';
    }

    exportPicture(): void {
        this.exportService.exportImage(this.exportMode, this.fileName);
    }
    close(): void {
        this.exportService.showModalExport = false;
    }
}
