import { Component } from '@angular/core';
@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    constructor() {}

    /* setResizerBottomRight(){
        this.resizer-bottom-right
        this.beet
         'cursor'= 'nwse-resize',

         this.

     }*/

    ResizerBottomRight = {
        ['cursor']: 'nwse-resize',
        ['margin-left']: '997px',
        ['margin-top']: '797px',
    };
    ResizerBottomline = {
        ['cursor']: 'row-resize',
        ['margin-left']: '500px',
        ['margin-top']: '797px',
    };
    ResizerRightLine = {
        ['cursor']: 'col-resize',
        ['margin-left']: '997px',
        ['margin-top']: '400px',
    };
}
