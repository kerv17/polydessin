import { Component, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
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
    @Input() opacity: number = Globals.GRID_OPACITY_INIT_VALUE;
    @Input() change: boolean;

    private functionMap: Map<string, () => void>;

    constructor(public gridService: GridService) {
        this.size = gridService.boxSize;
        this.opacity = gridService.opacity;
        this.functionMap = new Map();
        this.initFunctionMap();
    }

    updateSizeValues(evt: MatSliderChange): void {
        if (evt.value != null) {
            this.gridService.boxSize = evt.value;
            this.size = this.gridService.boxSize;
            const eventGrid: CustomEvent = new CustomEvent('grid');
            dispatchEvent(eventGrid);
        }
    }
    incrementSize(): void {
        this.gridService.shortcutIncrementGrid();
        this.size = this.gridService.boxSize;
        const eventGrid: CustomEvent = new CustomEvent('grid');
        dispatchEvent(eventGrid);
    }
    decrementSize(): void {
        this.gridService.shortcutDecrementGrid();
        this.size = this.gridService.boxSize;
        const eventGrid: CustomEvent = new CustomEvent('grid');
        dispatchEvent(eventGrid);
    }
    updateOpacityValues(evt: MatSliderChange): void {
        if (evt.value != null) {
            this.gridService.opacity = evt.value;
            this.opacity = this.gridService.opacity;
            const eventGrid: CustomEvent = new CustomEvent('grid');
            dispatchEvent(eventGrid);
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.change) {
            this.size = this.gridService.boxSize;
            this.opacity = this.gridService.opacity;
        }
    }

    @HostListener('window:keydown', ['$event'])
    onKeyPress($event: KeyboardEvent): void {
        if (!this.gridService.showGrid) {
            return;
        }

        if (this.functionMap.has([$event.key].join())) {
            this.functionMap.get([$event.key].join())?.call(this);
            $event.preventDefault();
        }
    }
    initFunctionMap(): void {
        // the key is a joined string comprised of the event shiftkey,eventCtrlKey,and the shortcut
        this.functionMap
            .set([Globals.GRID_INCREMENT_PLUS_SHORTCUT].join(), this.incrementSize)
            .set([Globals.GRID_INCREMENT_EQUAL_SHORTCUT].join(), this.incrementSize)
            .set([Globals.GRID_DECREMENT_SHORTCUT].join(), this.decrementSize);
    }
}
