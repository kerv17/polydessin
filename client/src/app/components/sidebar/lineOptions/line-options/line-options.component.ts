import { Component, Input } from '@angular/core';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';

@Component({
    selector: 'app-line-options',
    templateUrl: './line-options.component.html',
    styleUrls: ['./line-options.component.scss'],
})
export class LineOptionsComponent {
    @Input() change: boolean = false;
    linePoint: boolean = false;

    constructor(private toolControllerService: ToolControllerService) {
        // We need this because this componenent is recreated every time we switch tools
        // and this decides wetherthe slider appears
        this.linePoint = this.toolControllerService.getLineMode();
    }

    setPoint(point: boolean): void {
        this.toolControllerService.currentTool.toolMode = point ? 'point' : 'noPoint';
        this.linePoint = point;
    }
}
