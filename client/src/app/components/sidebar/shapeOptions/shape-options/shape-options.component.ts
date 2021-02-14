import { Component } from '@angular/core';
import * as Globals from '@app/Constants/constants';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';

@Component({
    selector: 'app-shape-options',
    templateUrl: './shape-options.component.html',
    styleUrls: ['./shape-options.component.scss'],
})
export class ShapeOptionsComponent {
    fillButton: { backgroundColor: string } = Globals.BACKGROUND_WHITE;
    borderButton: { backgroundColor: string } = Globals.BACKGROUND_WHITE;
    fillBorderButton: { backgroundColor: string } = Globals.BACKGROUND_WHITE;

    constructor(private toolControllerService: ToolControllerService) {}

    setFill(): void {
        this.toolControllerService.setFill();
        this.setButtonsWhite();
        this.fillButton = Globals.BACKGROUND_GAINSBORO;
    }
    setBorder(): void {
        this.toolControllerService.setBorder();
        this.setButtonsWhite();
        this.borderButton = Globals.BACKGROUND_GAINSBORO;
    }
    setFillBorder(): void {
        this.toolControllerService.setFillBorder();
        this.setButtonsWhite();
        this.fillBorderButton = Globals.BACKGROUND_GAINSBORO;
    }

    setButtonsWhite(): void {
        this.fillButton = Globals.BACKGROUND_WHITE;
        this.borderButton = Globals.BACKGROUND_WHITE;
        this.fillBorderButton = Globals.BACKGROUND_WHITE;
    }
}
