import { Component, HostListener } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    visible: boolean = false;
    width: boolean = false;
    fillBorder: boolean = false;
    set: boolean = true;
    crayon: { backgroundColor: string } = { backgroundColor: 'white' };
    rectangle: { backgroundColor: string } = { backgroundColor: 'white' };
    line: { backgroundColor: string } = { backgroundColor: 'white' };
    ellipsis: { backgroundColor: string } = { backgroundColor: 'white' };

    constructor(private service: ToolControllerService, private drawing: DrawingService) {}

    openCrayon(): void {
        this.service.setCrayon();
        this.fillBorder = false;
        this.set = !this.set;
        this.openWidth();
        this.setWhite();
        this.crayon = { backgroundColor: 'gainsboro' };
    }
    openRectangle(): void {
        this.service.setRectangle();
        this.fillBorder = true;
        this.set = !this.set;
        this.openWidth();
        this.setWhite();
        this.rectangle = { backgroundColor: 'gainsboro' };
    }

    openLine(): void {
        this.service.setLine();

        this.fillBorder = false;
        this.openWidth();
        this.set = !this.set;
        this.setWhite();
        this.line = { backgroundColor: 'gainsboro' };
    }

    openEllipsis(): void {
        this.service.setEllipse();
        this.fillBorder = true;
        this.openWidth();
        this.set = !this.set;
        this.setWhite();
        this.ellipsis = { backgroundColor: 'gainsboro' };
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

    openWidth(): void {
        this.width = true;
    }
    nouveauDessin(): void {
        this.drawing.nouveauDessin();
    }

    @HostListener('window:keydown', ['$event'])
    onKeyPress($event: KeyboardEvent): void {
        if (($event.ctrlKey || $event.metaKey) && $event.key == 'o') {
            $event.preventDefault();
            this.nouveauDessin();
        }
    }

    setWhite(): void {
        this.crayon = { backgroundColor: 'white' };
        this.rectangle = { backgroundColor: 'white' };
        this.ellipsis = { backgroundColor: 'white' };
        this.line = { backgroundColor: 'white' };
    }
}
