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

    /*setResizerBottomRight(){
        this.resizer-bottom-right
        this.beet
         'cursor'= 'nwse-resize',
     
         this.
         
    }*/
    

    convertToStringBottomRightX(): string {
        const bottomRightX: string = this.drawingService.initialCornerControl().x.toString();
        const retour: string = bottomRightX.concat('px');
        return retour;
        
    }
    convertToStringBottomRightY(): string {
        const bottomRightY: string = this.drawingService.initialCornerControl().y.toString();
        const retour: string = bottomRightY.concat('px');
        return retour;
    }
    convertToStringBottomLineX(): string {
        const bottomLineX: string = this.drawingService.initialBottomControl().x.toString();
        const retour: string = bottomLineX.concat('px');
        return retour;
    }
    convertToStringBottomLineY(): string {
        const bottomLineY: string = this.drawingService.initialBottomControl().y.toString();
        const retour: string = bottomLineY.concat('px');
        return retour;
    }
    convertToStringSideLineX(): string {
        const sideLineX: string = this.drawingService.initialSideControl().x.toString();
        const retour: string = sideLineX.concat('px');
        return retour;
    }
    convertToStringSideLineY(): string {
        const sideLineY: string = this.drawingService.initialSideControl().y.toString();
        const retour: string = sideLineY.concat('px');
        return retour;
    }
}
