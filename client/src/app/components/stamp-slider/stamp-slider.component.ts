import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import * as Globals from '@app/Constants/constants';
import { StampService } from '@app/services/tools/ToolServices/stamp.service';

@Component({
    selector: 'app-stamp-slider',
    templateUrl: './stamp-slider.component.html',
    styleUrls: ['./stamp-slider.component.scss'],
})
export class StampSliderComponent implements OnInit {
    @Input() width: number = 1;
    @Input() change: boolean;

    constructor(private tool: ToolControllerService) {}
    ngOnInit(): void {
    }

    updateWidthValues(evt: MatSliderChange): void {
        if (evt.value != null && evt.value !=undefined) {
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
