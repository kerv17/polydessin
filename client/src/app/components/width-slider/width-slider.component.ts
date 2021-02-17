import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';

@Component({
    selector: 'app-width-slider',
    templateUrl: './width-slider.component.html',
    styleUrls: ['./width-slider.component.scss'],
})
export class WidthSliderComponent implements OnChanges {
    @Input() width: number = 1;
    @Input() change: boolean;

    constructor(private tool: ToolControllerService) {}

    updateWidthValues(evt: MatSliderChange): void {
        if (evt.value != null) {
            this.tool.currentTool.width = evt.value;
            this.width = this.tool.currentTool.width;
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.change) {
            this.width = this.tool.currentTool.width;
        }
    }
}
