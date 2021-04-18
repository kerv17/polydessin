import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { AerosolService } from '@app/services/tools/ToolServices/aerosol-service.service';
import * as Globals from '@app/Constants/constants';

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
        throw new Error('Method not implemented.');
    }

    updateWidthValues(evt: MatSliderChange): void {
        if (evt.value != null) {
            (this.tool.getTool(Globals.STAMP_SHORTCUT) as AerosolService).width = evt.value;
            this.width = (this.tool.getTool(Globals.STAMP_SHORTCUT) as AerosolService).width;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.change) {
            this.width = (this.tool.getTool(Globals.AEROSOL_SHORTCUT) as AerosolService).width;
        }
    }
}
