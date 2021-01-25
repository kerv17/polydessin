import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Component({
    selector: 'app-color-palette',
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements AfterViewInit, OnChanges {
    @Input()
    hue: string;

    @Output()
    primaryColor: EventEmitter<string> = new EventEmitter(true);

    @Output()
    secondaryColor: EventEmitter<string> = new EventEmitter(true);

    @ViewChild('canvas')
    canvas: ElementRef<HTMLCanvasElement>;

    private ctx: CanvasRenderingContext2D;

    private mousedown: boolean = false;

    public selectedPosition: { x: number; y: number };

    ngAfterViewInit() {
        this.draw();
    }

    draw() {
        if (!this.ctx) {
            this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        }
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;

        this.ctx.fillStyle = this.hue || 'rgba(255,255,255,1)';
        this.ctx.fillRect(0, 0, width, height);

        const whiteGrad = this.ctx.createLinearGradient(0, 0, width, 0);
        whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
        whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');

        this.ctx.fillStyle = whiteGrad;
        this.ctx.fillRect(0, 0, width, height);

        const blackGrad = this.ctx.createLinearGradient(0, 0, 0, height);
        blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
        blackGrad.addColorStop(1, 'rgba(0,0,0,1)');

        this.ctx.fillStyle = blackGrad;
        this.ctx.fillRect(0, 0, width, height);

        if (this.selectedPosition) {
            this.ctx.strokeStyle = 'white';
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(this.selectedPosition.x, this.selectedPosition.y, 10, 0, 2 * Math.PI);
            this.ctx.lineWidth = 5;
            this.ctx.stroke();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['hue']) {
            this.draw();
            const pos = this.selectedPosition;
            if (pos) {
                this.primaryColor.emit(this.getColorAtPosition(pos.x, pos.y));
            }
        }
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(evt: MouseEvent) {
        this.mousedown = false;
        if(evt.button === MouseButton.Left){

        } 
        else if(evt.button === MouseButton.Right){
            
        }
    }

    onMouseDown(evt: MouseEvent) {
        this.mousedown = true;
        this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
        this.draw();
        if(evt.button === MouseButton.Left){
            this.primaryColor.emit(this.getColorAtPosition(evt.offsetX, evt.offsetY));
            //J'ai rajouté la ligne suivante parce que sino la couleur se fait juste update sur la pallete on mouse move
            this.emitColor(evt.offsetX, evt.offsetY, MouseButton.Left);
        }
        else if (evt.button === MouseButton.Right){
            this.secondaryColor.emit(this.getColorAtPosition(evt.offsetX, evt.offsetY));
            //J'ai rajouté la ligne suivante parce que sino la couleur se fait juste update sur la pallete on mouse move
            this.emitColor(evt.offsetX, evt.offsetY, MouseButton.Right);
        }
        
    }

    onMouseMove(evt: MouseEvent) {
        if (this.mousedown) {
            this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
            this.draw();
            if (evt.button === MouseButton.Left){
                this.emitColor(evt.offsetX, evt.offsetY, MouseButton.Left);
            }
            else if (evt.button === MouseButton.Right){
                this.emitColor(evt.offsetX, evt.offsetY, MouseButton.Right);
            }
    
        }
    }

    emitColor(x: number, y: number, side : number) {
        const rgbaColor = this.getColorAtPosition(x, y);
        
        if (side == MouseButton.Left){
            sessionStorage.setItem('primaryColor', rgbaColor);
            this.primaryColor.emit(rgbaColor);
        }
        else if (side == MouseButton.Right){
            sessionStorage.setItem('secondaryColor', rgbaColor);
            this.secondaryColor.emit(rgbaColor);
        }
    }

    getColorAtPosition(x: number, y: number) {
        const imageData = this.ctx.getImageData(x, y, 1, 1).data;
        return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    }
}
