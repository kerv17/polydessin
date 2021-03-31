import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { GridService } from '@app/services/grid/grid.service';
@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnChanges {
    @Input() size: number = 20;
    @Input() sizeChange: boolean;
    @Input() opacity: number = 20;
    @Input() opacityChange: boolean;
    constructor(private gridService: GridService) {}

    updateSizeValues(evt: MatSliderChange): void {
        if (evt.value != null) {
            this.gridService.boxSize = evt.value;
            this.size = this.gridService.boxSize;
        }
    }
    updateOpacityValues(evt: MatSliderChange): void {
        if (evt.value != null) {
            //  (this.tool.getTool(Globals.AEROSOL_SHORTCUT) as AerosolService).sprayAmountPerSecond = evt.value;
            //  this.width = (this.tool.getTool(Globals.AEROSOL_SHORTCUT) as AerosolService).sprayAmountPerSecond;
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.sizeChange) {
            // this.width = (this.tool.getTool(Globals.AEROSOL_SHORTCUT) as AerosolService).sprayAmountPerSecond;
        }
        if (changes.opacityChange) {
            // this.width = (this.tool.getTool(Globals.AEROSOL_SHORTCUT) as AerosolService).sprayAmountPerSecond;
        }
    }
}

/*

import { MatSliderChange } from '@angular/material/slider';
import * as Globals from '@app/Constants/constants';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { AerosolService } from '@app/services/tools/ToolServices/aerosol-service.service';

export class SprayAmountSliderComponent implements OnChanges {
    @Input() size: number = 20;
    @Input() change: boolean;

    updateWidthValues(evt: MatSliderChange): void {
        if (evt.value != null) {
            (this.tool.getTool(Globals.AEROSOL_SHORTCUT) as AerosolService).sprayAmountPerSecond = evt.value;
            this.width = (this.tool.getTool(Globals.AEROSOL_SHORTCUT) as AerosolService).sprayAmountPerSecond;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.change) {
            this.width = (this.tool.getTool(Globals.AEROSOL_SHORTCUT) as AerosolService).sprayAmountPerSecond;
        }
    }
}*/
