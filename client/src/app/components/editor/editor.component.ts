import { Component } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    constructor(private drawingService: DrawingService) {}

    ResizerBottomRight = {
        ['cursor']: 'nwse-resize',
        ['margin-left']: this.convertToStringBottomRightX(),
        ['margin-top']: this.convertToStringBottomRightY(),
    };
    ResizerBottomline = {
        ['cursor']: 'row-resize',
        ['margin-left']: this.convertToStringBottomLineX(),
        ['margin-top']: this.convertToStringBottomLineY(),
    };
    ResizerRightLine = {
        ['cursor']: 'col-resize',
        ['margin-left']: this.convertToStringSideLineX(),
        ['margin-top']: this.convertToStringSideLineY(),
    };
    convertToStringBottomRightX(): string {
        const bottomRightX: string = this.drawingService.positionCornerControl().x.toString();
        const retour: string = bottomRightX.concat('px');
        return retour;
    }
    convertToStringBottomRightY(): string {
        const bottomRightY: string = this.drawingService.positionCornerControl().y.toString();
        const retour: string = bottomRightY.concat('px');
        return retour;
    }
    convertToStringBottomLineX(): string {
        const bottomLineX: string = this.drawingService.positionBottomControl().x.toString();
        const retour: string = bottomLineX.concat('px');
        return retour;
    }
    convertToStringBottomLineY(): string {
        const bottomLineY: string = this.drawingService.positionBottomControl().y.toString();
        const retour: string = bottomLineY.concat('px');
        return retour;
    }
    convertToStringSideLineX(): string {
        const sideLineX: string = this.drawingService.positionSideControl().x.toString();
        const retour: string = sideLineX.concat('px');
        return retour;
    }
    convertToStringSideLineY(): string {
        const sideLineY: string = this.drawingService.positionSideControl().y.toString();
        const retour: string = sideLineY.concat('px');
        return retour;
    }

    resizeFunct(e: MouseEvent): void {
        this.drawingService.controlSize.y = e.pageY;
    }
    stopResize(e: MouseEvent): void {
        window.removeEventListener('mousemove', this.resizeFunct);
        window.removeEventListener('mouseup', this.stopResize);

        this.drawingService.canvasSize = this.drawingService.controlSize;
    }
    resizeBottomControl(): void {
        const resizer = document.getElementById('ResizerBottomLine');
        if (resizer != null) {
            resizer.addEventListener('mousedown', (e: MouseEvent): void => {
                e.preventDefault();

                window.addEventListener('mousemove', this.resizeFunct);
                window.addEventListener('mouseup', this.stopResize);
            });
        }
    }
}
