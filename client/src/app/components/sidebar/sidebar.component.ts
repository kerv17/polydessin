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
    width: boolean = true;
    fillBorder: boolean = false;
    resetSlider: boolean = true;
    linePoint: boolean = false;
    lineOn: boolean = false;
    crayon: { backgroundColor: string } = { backgroundColor: 'white' };
    rectangle: { backgroundColor: string } = { backgroundColor: 'white' };
    line: { backgroundColor: string } = { backgroundColor: 'white' };
    ellipsis: { backgroundColor: string } = { backgroundColor: 'white' };

    constructor(private service: ToolControllerService, private drawing: DrawingService) {}
    // TODO esseyer d'optimiser encore plus
    openCrayon(): void {
        this.service.setTool(Globals.crayonShortcut);
        this.openTool(false, true);
        this.crayon = Globals.backgroundGainsoboro;
    }
    openRectangle(): void {
        this.service.setTool(Globals.rectangleShortcut);
        this.openTool(true, true);
        this.rectangle = Globals.backgroundGainsoboro;
    }

    openLine(): void {
        this.service.setTool(Globals.lineShortcut);
        this.openTool(false, true, true);
        this.linePoint = this.service.currentTool.toolMode === 'point';
        this.line = Globals.backgroundGainsoboro;
    }

    openEllipsis(): void {
        this.service.setTool(Globals.ellipsisShortcut);
        this.openTool(true, true);
        this.ellipsis = Globals.backgroundGainsoboro;
    }
    openTool(fillBorder: boolean, openWidth: boolean, lineOn: boolean = false): void {
        this.fillBorder = fillBorder;
        if (openWidth) this.openWidth();
        this.resetSlider = !this.resetSlider;
        this.lineOn = lineOn;
        this.setButtonWhite();
    }

    setFill(): void {
        this.service.setFill();
    }
    setBorder(): void {
        this.service.setBorder();
    }
    setFillBorder(): void {
        this.service.setFillBorder();
    }

    setPoint(point: boolean): void {
        this.service.currentTool.toolMode = point ? 'point' : 'noPoint';
        this.linePoint = point;
    }

    openWidth(): void {
        this.width = true;
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
