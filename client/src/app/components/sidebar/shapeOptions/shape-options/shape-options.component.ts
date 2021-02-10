import { Component, OnInit } from '@angular/core';
import * as Globals from '@app/Constants/constants';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';

@Component({
    selector: 'app-shape-options',
    templateUrl: './shape-options.component.html',
    styleUrls: ['./shape-options.component.scss'],
})
export class ShapeOptionsComponent implements OnInit {
    fillButton: { backgroundColor: string } = Globals.backgroundWhite;
    borderButton: { backgroundColor: string } = Globals.backgroundWhite;
    fillBorderButton: { backgroundColor: string } = Globals.backgroundWhite;

    constructor(private toolControllerService: ToolControllerService) {}

    setFill(): void {
        this.toolControllerService.setFill();
        this.setButtonsWhite();
        this.fillButton = Globals.backgroundGainsoboro;
    }
    setBorder(): void {
        this.toolControllerService.setBorder();
        this.setButtonsWhite();
        this.borderButton = Globals.backgroundGainsoboro;
    }
    setFillBorder(): void {
        this.toolControllerService.setFillBorder();
        this.setButtonsWhite();
        this.fillBorderButton = Globals.backgroundGainsoboro;
    }

    setButtonsWhite(): void {
        this.fillButton = Globals.backgroundWhite;
        this.borderButton = Globals.backgroundWhite;
        this.fillBorderButton = Globals.backgroundWhite;
    }

    ngOnInit(): void {}
}
