import { Component, HostListener } from '@angular/core';
import * as Globals from '@app/Constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    visible: boolean = false;
    showWidth: boolean = false;
    fillBorder: boolean = true;
    resetSlider: boolean = true;
    crayon: { backgroundColor: string } = { backgroundColor: 'white' };
    rectangle: { backgroundColor: string } = { backgroundColor: 'white' };
    line: { backgroundColor: string } = { backgroundColor: 'white' };
    ellipsis: { backgroundColor: string } = { backgroundColor: 'white' };

    constructor(private service: ToolControllerService, private drawing: DrawingService) {}
    // TODO esseyer d'optimiser encore plus
    openCrayon(): void {
        this.service.setTool(Globals.crayonShortcut);
        this.openTool(!this.fillBorder, !this.showWidth);
        this.crayon = Globals.backgroundGainsoboro;
    }
    openRectangle(): void {
        this.service.setTool(Globals.rectangleShortcut);
        this.openTool(this.fillBorder, !this.showWidth);
        this.rectangle = Globals.backgroundGainsoboro;
    }

    openLine(): void {
        this.service.setTool(Globals.lineShortcut);
        this.openTool(!this.fillBorder, !this.showWidth);
        this.line = Globals.backgroundGainsoboro;
    }

    openEllipsis(): void {
        this.service.setTool(Globals.ellipsisShortcut);
        this.openTool(this.fillBorder, !this.showWidth);
        this.ellipsis = Globals.backgroundGainsoboro;
    }
    openTool(fillBorder: boolean, showWidth: boolean): void {
        this.fillBorder = fillBorder;
        this.showWidth = showWidth;
        this.resetSlider = !this.resetSlider;
        this.setButtonWhite();
    }

    nouveauDessin(): void {
        this.drawing.nouveauDessin();
    }

    @HostListener('window:keydown', ['$event'])
    onKeyPress($event: KeyboardEvent): void {
        if (($event.ctrlKey || $event.metaKey) && $event.key === Globals.newDrawingEvent) {
            $event.preventDefault();
            this.nouveauDessin();
        }
    }

    setButtonWhite(): void {
        this.crayon = Globals.backgroundWhite;
        this.rectangle = Globals.backgroundWhite;
        this.ellipsis = Globals.backgroundWhite;
        this.line = Globals.backgroundWhite;
    }
}
