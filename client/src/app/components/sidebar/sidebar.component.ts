import { Component, HostListener } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    visible = false;
    width: boolean = false;
    fillBorder: boolean = false;
    set: boolean = true;

    constructor(private service: ToolControllerService, private drawing: DrawingService) {}

    openCrayon() {
        this.setBackgroundColor('crayon');
        this.service.setTool();
        this.fillBorder = false;
        this.set = !this.set;

        this.openWidth();
    }
    openRectangle() {
        this.service.setRectangle();
        this.setBackgroundColor('rectangle');
        this.fillBorder = true;
        this.set = !this.set;
        this.openWidth();
    }

    openLine() {
        this.service.setLine();
        this.setBackgroundColor('line');
        this.fillBorder = false;
        this.openWidth();
        this.set = !this.set;
    }

    openEllipsis() {
        this.service.setEllipse();
        this.setBackgroundColor('ellipsis');
        this.fillBorder = true;
        this.openWidth();
        this.set = !this.set;
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

    openWidth() {
        this.width = true;
    }
    nouveauDessin() {
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
}
