import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import {
    GRADIENT_LEVEL_1,
    GRADIENT_LEVEL_2,
    GRADIENT_LEVEL_3,
    GRADIENT_LEVEL_4,
    GRADIENT_LEVEL_5,
    LINE_HEIGTH_PALETTE,
    LINE_WIDTH_PALETTE,
} from '@app/Constants/constants';

@Component({
    selector: 'app-color-slider',
    templateUrl: './color-slider.component.html',
    styleUrls: ['./color-slider.component.scss'],
})

/*
    RÉFÉRENCES POUR LE CODE DU COMPONENT COLOR-SLIDER:
    Le présent code est tiré du tutoriel "Creating a Color Picker Component with Angular" de Lukas Marx, publié le 18 septembre 2018
    disponible à l'adresse suivante : "https://malcoded.com/posts/angular-color-picker/"
    Quelques modifications y ont été apportées
*/
export class ColorSliderComponent implements AfterViewInit {
    @ViewChild('canvas')
    canvas: ElementRef<HTMLCanvasElement>;

    @Output()
    color: EventEmitter<string> = new EventEmitter(true);

    ctx: CanvasRenderingContext2D;
    mousedown: boolean = false;
    selectedHeight: number;

    ngAfterViewInit(): void {
        this.draw();
    }

    draw(): void {
        if (!this.ctx) {
            this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        }
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;

        this.ctx.clearRect(0, 0, width, height);

        const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
        gradient.addColorStop(GRADIENT_LEVEL_1, 'rgba(255, 255, 0, 1)');
        gradient.addColorStop(GRADIENT_LEVEL_2, 'rgba(0, 255, 0, 1)');
        gradient.addColorStop(GRADIENT_LEVEL_3, 'rgba(0, 255, 255, 1)');
        gradient.addColorStop(GRADIENT_LEVEL_4, 'rgba(0, 0, 255, 1)');
        gradient.addColorStop(GRADIENT_LEVEL_5, 'rgba(255, 0, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

        this.ctx.beginPath();
        this.ctx.rect(0, 0, width, height);

        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.closePath();

        if (this.selectedHeight) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = LINE_WIDTH_PALETTE;
            this.ctx.rect(0, this.selectedHeight - LINE_WIDTH_PALETTE, width, LINE_HEIGTH_PALETTE);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(evt: MouseEvent): void {
        this.mousedown = false;
    }

    onMouseDown(evt: MouseEvent): void {
        this.mousedown = true;
        this.selectedHeight = evt.offsetY;
        this.draw();
        this.emitColor(evt.offsetX, evt.offsetY);
    }

    onMouseMove(evt: MouseEvent): void {
        if (this.mousedown) {
            this.selectedHeight = evt.offsetY;
            this.draw();
            this.emitColor(evt.offsetX, evt.offsetY);
        }
    }

    emitColor(x: number, y: number): void {
        this.color.emit(this.getColorAtPosition(x, y));
    }

    getColorAtPosition(x: number, y: number): string {
        const imageData = this.ctx.getImageData(x, y, 1, 1).data;
        return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    }
}
