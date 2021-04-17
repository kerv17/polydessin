import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import * as Globals from '@app/Constants/constants';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { AerosolService } from '@app/services/tools/ToolServices/aerosol.service';

@Component({
    selector: 'spray-amount-slider',
    templateUrl: './spray-amount-slider.component.html',
    styleUrls: ['./spray-amount-slider.component.scss'],
})
export class SprayAmountSliderComponent implements OnChanges {
    @Input() width: number = 1;
    @Input() change: boolean;

    constructor(private tool: ToolControllerService) {}

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
}
