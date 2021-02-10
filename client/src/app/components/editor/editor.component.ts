import { Component } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    mouseDown: boolean = false;
    posX: number;
    posY: number;
    position: number;

    constructor(private drawingService: DrawingService) {
        this.drawingService.setSizeCanva();
        this.posX = this.drawingService.controlSize.x;
        this.posY = this.drawingService.controlSize.y;
        this.setResizerBottomLine();
        this.setResizerRightLine();
        this.setResizerBottomRight();
    }

    resizerBottomLine: { [key: string]: string };
    resizerRightLine: { [key: string]: string };
    resizerBottomRight: { [key: string]: string };
    setResizerRightLine(): void {
        this.resizerRightLine = {
            cursor: 'col-resize',
            'margin-left': String(this.posX) + 'px',
            'margin-top': String(this.posY / 2) + 'px',
        };
    }

    setResizerBottomRight(): void {
        this.resizerBottomRight = {
            cursor: 'nwse-resize',
            'margin-left': String(this.posX) + 'px',
            'margin-top': String(this.posY) + 'px',
        };
    }

    setResizerBottomLine(): void {
        this.resizerBottomLine = {
            cursor: 'row-resize',
            'margin-left': String(this.posX / 2) + 'px',
            'margin-top': String(this.posY) + 'px',
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

    mouseDownHandler(event: MouseEvent, pos: number): void {
        this.mouseDown = true;
        this.position = pos;
    }

    mouseMoveHandler(event: MouseEvent): void {
        if (this.position === 0) {
            this.mouseMoveHandlerCorner(event);
        } else if (this.position === 1) {
            this.mouseMoveHandlerBottom(event);
        } else if (this.position === 2) {
            this.mouseMoveHandlerRight(event);
        }
    }

    mouseMoveHandlerRight(event: MouseEvent): void {
        if (this.mouseDown) {
            if (event.offsetX >= 250) {
                this.posX = event.offsetX;
            } else {
                this.posX = 250;
            }
            this.setResizerBottomLine();
            this.setResizerRightLine();
            this.setResizerBottomRight();
        }
    }

    mouseMoveHandlerBottom(event: MouseEvent): void {
        if (this.mouseDown) {
            if (event.offsetY >= 250) {
                this.posY = event.offsetY;
            } else {
                this.posY = 250;
            }
            this.setResizerBottomLine();
            this.setResizerRightLine();
            this.setResizerBottomRight();
        }
    }

    mouseMoveHandlerCorner(event: MouseEvent): void {
        if (this.mouseDown) {
            if (event.offsetX >= 250) {
                this.posX = event.offsetX;
            } else {
                this.posX = 250;
            }

            if (event.offsetY >= 250) {
                this.posY = event.offsetY;
            } else {
                this.posY = 250;
            }
            this.setResizerBottomLine();
            this.setResizerRightLine();
            this.setResizerBottomRight();
        }
    }

    mouseUpHandler(event: MouseEvent): void {
        this.mouseDown = false;
    }
}
