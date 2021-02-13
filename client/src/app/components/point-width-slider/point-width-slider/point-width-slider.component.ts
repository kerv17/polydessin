import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';

@Component({
    selector: 'app-point-width-slider',
    templateUrl: './point-width-slider.component.html',
    styleUrls: ['./point-width-slider.component.scss'],
})
export class PointWidthSliderComponent implements OnChanges {
    @Input() pointWidth: number = 1;
    @Input() change: boolean;
    constructor(private tool: ToolControllerService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.change) {
            this.pointWidth = this.tool.currentTool.pointWidth;
        }
    }

    getPointSliderValue(evt: MatSliderChange): void {
        if (evt.value != null) {
            this.tool.currentTool.pointWidth = evt.value;
            this.pointWidth = this.tool.currentTool.pointWidth;
        }
    }
}
