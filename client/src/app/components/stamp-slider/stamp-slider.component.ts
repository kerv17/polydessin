import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import * as Globals from '@app/Constants/constants';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { StampService } from '@app/services/tools/ToolServices/stamp.service';

@Component({
    selector: 'app-stamp-slider',
    templateUrl: './stamp-slider.component.html',
    styleUrls: ['./stamp-slider.component.scss'],
})
export class StampSliderComponent implements OnChanges {
    @Input() width: number = 1;
    @Input() change: boolean;

    constructor(private tool: ToolControllerService) {}

    updateWidthValues(evt: MatSliderChange): void {
        if (evt.value != null && evt.value != undefined) {
            (this.tool.getTool(Globals.STAMP_SHORTCUT) as StampService).width = evt.value;
            this.width = evt.value;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.change) {
            this.width = (this.tool.getTool(Globals.STAMP_SHORTCUT) as StampService).width;
        }
    }
}
