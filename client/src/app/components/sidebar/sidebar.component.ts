import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import * as Globals from '@app/Constants/constants';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    showWidth: boolean = false;
    fillBorder: boolean = false;
    showline: boolean = false;
    resetSlider: boolean = false;
    crayon: { backgroundColor: string } = Globals.BACKGROUND_WHITE;
    rectangle: { backgroundColor: string } = Globals.BACKGROUND_WHITE;
    line: { backgroundColor: string } = Globals.BACKGROUND_WHITE;
    ellipsis: { backgroundColor: string } = Globals.BACKGROUND_WHITE;

    constructor(
        private toolcontroller: ToolControllerService,
        private drawing: DrawingService,
        private router: Router,
        private colorService: ColorService,
    ) {
        this.openCrayon();
    }

    goBack(): void {
        this.router.navigate(['..']);
        this.resetDrawingAttributes();
    }
    resetDrawingAttributes(): void {
        this.colorService.resetColorValues();
        this.toolcontroller.resetWidth();
    }
    // TODO esseyer d'optimiser encore plus
    openCrayon(): void {
        this.toolcontroller.setTool(Globals.CRAYON_SHORTCUT);
        this.openTool(false, true);
        this.crayon = Globals.BACKGROUND_GAINSBORO;
    }
    openRectangle(): void {
        this.toolcontroller.setTool(Globals.RECTANGLE_SHORTCUT);
        this.openTool(true, true);
        this.rectangle = Globals.BACKGROUND_GAINSBORO;
    }

    openLine(): void {
        this.toolcontroller.setTool(Globals.LINE_SHORTCUT);
        this.openTool(false, true, true);
        this.line = Globals.BACKGROUND_GAINSBORO;
    }

    openEllipsis(): void {
        this.toolcontroller.setTool(Globals.ELLIPSIS_SHORTCUT);
        this.openTool(true, true);
        this.ellipsis = Globals.BACKGROUND_GAINSBORO;
    }
    openTool(fillBorder: boolean, showWidth: boolean, showline: boolean = false): void {
        this.fillBorder = fillBorder;
        this.showWidth = showWidth;
        this.showline = showline;
        this.resetSlider = !this.resetSlider;
        this.setButtonWhite();
    }

    newCanvas(): void {
        this.drawing.newCanvas();
        this.service.currentTool.clearPath();
    }

    @HostListener('window:keydown', ['$event'])
    onKeyPress($event: KeyboardEvent): void {
        if ($event.ctrlKey && $event.key === Globals.NEW_DRAWING_EVENT) {
            $event.preventDefault();
            this.drawing.newCanvas();
        }
    }

    setButtonWhite(): void {
        this.crayon = Globals.BACKGROUND_WHITE;
        this.rectangle = Globals.BACKGROUND_WHITE;
        this.ellipsis = Globals.BACKGROUND_WHITE;
        this.line = Globals.BACKGROUND_WHITE;
    }
}
