import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import * as Globals from '@app/Constants/constants';
import { GridService } from '@app/services/grid/grid.service';
@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnChanges {
    @Input() size: number = Globals.GRID_BOX_INIT_VALUE;
    // @Input() changeSize: boolean;

    @Input() opacity: number = Globals.GRID_OPACITY_INIT_VALUE;
    // @Input() opacityChange: boolean;
    @Input() change: boolean;

    constructor(public gridService: GridService) {}

    updateSizeValues(evt: MatSliderChange): void {
        if (evt.value != null) {
            this.gridService.boxSize = evt.value;
            this.size = this.gridService.boxSize;
            const eventGrid: CustomEvent = new CustomEvent('grid', { detail: 'drawingAction' });
            dispatchEvent(eventGrid);
        }
    }
    updateOpacityValues(evt: MatSliderChange): void {
        if (evt.value != null) {
            this.gridService.opacity = evt.value;
            this.opacity = this.gridService.opacity;
            const eventGrid: CustomEvent = new CustomEvent('grid', { detail: 'drawingAction' });
            dispatchEvent(eventGrid);
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.change) {
            this.size = this.gridService.boxSize;
            this.opacity = this.gridService.opacity;
        }
    }
}
