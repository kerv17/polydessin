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

    openCrayon() {
        this.service.setTool();
        this.fillBorder = false;
        this.set = !this.set;
        this.openWidth();
        this.setWhite();
        this.crayon = { backgroundColor: 'gainsboro' };
    }
    openRectangle() {
        this.service.setRectangle();
        this.fillBorder = true;
        this.set = !this.set;
        this.openWidth();
        this.setWhite();
        this.rectangle = { backgroundColor: 'gainsboro' };
    }

    openLine() {
        this.service.setLine();
        this.setBackgroundColor('line');
        this.fillBorder = false;
        this.openWidth();
        this.set = !this.set;
        this.setWhite();
        this.line = { backgroundColor: 'gainsboro' };
    }

    openEllipsis() {
        this.service.setEllipse();
        this.fillBorder = true;
        this.openWidth();
        this.set = !this.set;
        this.setWhite();
        this.ellipsis = { backgroundColor: 'gainsboro' };
    }
    setBackgroundColor(name: string): void {
        // DOIT ETRE SCRAPPER AU COMPLET!

        const fill: HTMLElement | null = document.getElementById('fillButton');
        const border: HTMLElement | null = document.getElementById('borderButton');
        const fillBorder: HTMLElement | null = document.getElementById('fillBorderButton');
        if (name == 'fill' || name == 'border' || name == 'fillBorder') {
            if (fill != null && border != null && fillBorder != null) {
                fill.style.backgroundColor = 'white';
                border.style.backgroundColor = 'white';
                fillBorder.style.backgroundColor = 'white';

                switch (name) {
                    case 'fill':
                        fill.style.backgroundColor = 'gainsboro';
                        break;
                    case 'border':
                        border.style.backgroundColor = 'gainsboro';
                        break;
                    case 'fillBorder':
                        fillBorder.style.backgroundColor = 'gainsboro';
                        break;
                    default:
                        break;
                }
            }
        }
    }

    setFill() {
        this.service.setFill();
        this.setBackgroundColor('fill');
    }
    setBorder() {
        this.service.setBorder();
        this.setBackgroundColor('border');
    }
    setFillBorder() {
        this.service.setFillBorder();
        this.setBackgroundColor('fillBorder');
    }

    resetButtonColor(crayon: HTMLElement, rectangle: HTMLElement, line: HTMLElement, ellipsis: HTMLElement): void {
        crayon.style.backgroundColor = 'white';
        rectangle.style.backgroundColor = 'white';
        ellipsis.style.backgroundColor = 'white';
        line.style.backgroundColor = 'white';
    }

    openWidth(): void {
        this.width = true;
    }
    nouveauDessin(): void {
        this.drawing.nouveauDessin();
    }

    @HostListener('window:keydown', ['$event'])
    onKeyPress($event: KeyboardEvent) {
        if (($event.ctrlKey || $event.metaKey) && $event.key == 'o') {
            $event.preventDefault();
            this.nouveauDessin();
        }
    }

    setMode(mode: string) {}

    setWhite(): void {
        this.crayon = { backgroundColor: 'white' };
        this.rectangle = { backgroundColor: 'white' };
        this.ellipsis = { backgroundColor: 'white' };
        this.line = { backgroundColor: 'white' };
    }
}
