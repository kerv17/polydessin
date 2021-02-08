import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

// à mettre dans un autre fichier
const gradientLevel1 = 0.17;
const gradientLevel2 = 0.34;
const gradientLevel3 = 0.51;
const gradientLevel4 = 0.68;
const gradientLevel5 = 0.81;
const lineWidth = 5;
const lineHeigth = 10;

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
        gradient.addColorStop(gradientLevel1, 'rgba(255, 255, 0, 1)');
        gradient.addColorStop(gradientLevel2, 'rgba(0, 255, 0, 1)');
        gradient.addColorStop(gradientLevel3, 'rgba(0, 255, 255, 1)');
        gradient.addColorStop(gradientLevel4, 'rgba(0, 0, 255, 1)');
        gradient.addColorStop(gradientLevel5, 'rgba(255, 0, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

        this.ctx.beginPath();
        this.ctx.rect(0, 0, width, height);

        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.closePath();

        if (this.selectedHeight) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = lineWidth;
            this.ctx.rect(0, this.selectedHeight - lineWidth, width, lineHeigth);
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
