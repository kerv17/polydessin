import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EditorService } from '@app/services/editor/editor.service';
@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    sizeCanvas: Vec2;

    @ViewChild('containerIWant') elementView: ElementRef;
      viewHeight: number;

    constructor(public drawingService: DrawingService, public editorService: EditorService) {
        this.sizeCanvas = this.drawingService.setSizeCanva();
        this.editorService.resetControlPoints(this.sizeCanvas.x, this.sizeCanvas.y);
    }

    mouseDownHandler(event: MouseEvent, pos: number): void {
        this.editorService.mouseDown = true;
        this.editorService.position = pos;
        this.elementView.nativeElement.off
        // let elmnt = document.getElementsByClassName("drawing-container");
        /*if(elmnt){
            window.alert(elmnt?.clientHeight);
            window.alert(elmnt?.clientTop);
            window.alert(elmnt?.offsetHeight);
            window.alert(elmnt?.offsetTop);
        }*/
    }
    @HostListener('mousemove', ['$event'])
    mouseMoveHandler(event: MouseEvent): void {
        switch (this.editorService.position) {
            case 0:
                this.editorService.mouseMoveHandlerCorner(event);
                break;
            case 1:
                this.editorService.mouseMoveHandlerBottom(event);
                break;
            case 2:
                this.editorService.mouseMoveHandlerRight(event);
                break;
        }
    }

    @HostListener('mouseup', ['$event'])
    mouseUpHandler(event: MouseEvent): void {
        this.editorService.mouseDown = false;
    }

    hideResizer(): boolean {
        return !this.editorService.mouseDown;
    }
}
