import { Component, HostListener } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    constructor(private drawingService: DrawingService) {
        this.drawingService.setSizeCanva();
        this.setResizerBottomLine();
        this.setResizerRightLine();
        this.setResizerBottomRight();
    }

    resizerBottomLine: { [key: string]: string };
    resizerRightLine: { [key: string]: string };
    resizerBottomRight: { [key: string]: string };
    setResizerRightLine(): void {
        this.resizerRightLine = {
            'cursor': 'col-resize',
            'margin-left': String(this.drawingService.controlSize.x) + 'px',
            'margin-top': String(this.drawingService.controlSize.y / 2) + 'px',
        };
    }

    setResizerBottomRight(): void {
        this.resizerBottomRight = {
            'cursor': 'nwse-resize',
            'margin-left': String(this.drawingService.controlSize.x) + 'px',
            'margin-top': String(this.drawingService.controlSize.y) + 'px',
        };
    }

    setResizerBottomLine(): void {
        this.resizerBottomLine = {
            'cursor': 'row-resize',
            'margin-left': String(this.drawingService.controlSize.x / 2) + 'px',
            'margin-top': String(this.drawingService.controlSize.y) + 'px',
        };
    }
    // laisser au cas ou
    /*resizeFunct(e: MouseEvent): void {
        this.drawingService.controlSize.y = e.pageY;
        this.setResizerBottomLine();
    }*/
    /*stopResize(e: MouseEvent): void {
        window.removeEventListener('mousemove', this.resizeFunct);
        // window.removeEventListener('mouseup', this.stopResize);

        this.drawingService.canvasSize = this.drawingService.controlSize;
    }*/
    @HostListener('mouseup')
    mouseup(): void{
        this.drawingService.canvasSize = this.drawingService.controlSize;
    }

    @HostListener('mousmove', ['$event'])
    mousemove(event: MouseEvent): void{
        this.drawingService.controlSize.y = event.pageY;
        this.setResizerBottomLine();
        window.alert('bouge');
    }
    resizeBottomControl(): void {
        const resizer = document.getElementById('ResizerBottomLine');
        if (resizer != null) {
            resizer.addEventListener('mousedown', (e: MouseEvent): void => {
                e.preventDefault();
                this.setResizerBottomLine();
                // laisser au cas ou
                // window.addEventListener('mousemove', this.resizeFunct);
                // window.addEventListener('mouseup', this.stopResize);
            });
        }
    }
}
