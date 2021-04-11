import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import * as Globals from '@app/Constants/constants';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { BucketService } from '@app/services/tools/ToolServices/bucket.service';

@Component({
    selector: 'app-bucket-tolerance',
    templateUrl: './bucket-tolerance.component.html',
    styleUrls: ['./bucket-tolerance.component.scss'],
})
export class BucketToleranceComponent implements OnChanges {
    constructor(private toolController: ToolControllerService) {}
    @Input() tolerance: number = 0;
    @Input() change: boolean;

    updateWidthValues(evt: MatSliderChange): void {
        if (evt.value != null) {
            (this.toolController.getTool(Globals.BUCKET_SHORTCUT) as BucketService).tolerance = evt.value;
            this.tolerance = (this.toolController.getTool(Globals.BUCKET_SHORTCUT) as BucketService).tolerance;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.change) {
            this.tolerance = (this.toolController.getTool(Globals.BUCKET_SHORTCUT) as BucketService).tolerance;
        }
    }
}
