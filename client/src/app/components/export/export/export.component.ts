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
    exportMode: string;
    width: number;
    height: number;
    filtre: string;
    fileName: string = 'canvas';

    ngAfterViewInit(): void {
        this.ctx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.ctx.drawImage(this.exportService.drawingService.canvas, 0, 0, this.width, this.height);
    }
    togglePng(): void {
        this.exportMode = 'png';
    }
    setFiltre(buttonfiltre: string): void {
        this.filtre = buttonfiltre;
        this.ctx.filter = this.filtre;
        this.ctx.drawImage(this.exportService.drawingService.canvas, 0, 0, this.width, this.height);
    }
    toggleJpg(): void {
        this.exportMode = 'jpeg';
    }

    exportPicture(): void {
        this.exportService.exportImage(this.exportMode, this.fileName, this.filtre);
    }
    close(): void {
        this.exportService.showModalExport = false;
    }


}
