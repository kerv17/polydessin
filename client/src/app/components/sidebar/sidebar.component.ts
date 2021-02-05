import { Component, HostListener } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    width: boolean = false;
    constructor(private service: ToolControllerService, private drawing: DrawingService) {}

    openCrayon() {
        this.setBackgroundColor('crayon');
        this.service.setTool();
        this.openWidth();
    }
    openRectangle() {
        this.service.setRectangle();
        this.setBackgroundColor('rectangle');
        this.openWidth();
    }

    openLine() {
        this.service.setLine();
        this.setBackgroundColor('line');
        this.openWidth();
    }

    openEllipsis() {
        this.service.setEllipse();
        this.setBackgroundColor('ellipsis');
        this.openWidth();
    }
    setBackgroundColor(name: string): void {
        const crayon: HTMLElement | null = document.getElementById('CrayonButton');
        const rectangle: HTMLElement | null = document.getElementById('RectangleButton');
        const line: HTMLElement | null = document.getElementById('LineButton');
        const ellipsis: HTMLElement | null = document.getElementById('EllipsisButton');

        if (crayon != null && rectangle != null && line != null && ellipsis != null) {
            this.resetButtonColor(crayon, rectangle, line, ellipsis);
            switch (name) {
                case 'crayon':
                    crayon.style.backgroundColor = 'gainsboro';

                    break;
                case 'rectangle':
                    rectangle.style.backgroundColor = 'gainsboro';

                    break;
                case 'line':
                    line.style.backgroundColor = 'gainsboro';

                    break;
                case 'ellipsis':
                    ellipsis.style.backgroundColor = 'gainsboro';

                    break;
                default:
                    break;
            }
        }
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
        if (($event.ctrlKey || $event.metaKey) && $event.key == '0') this.nouveauDessin();
    }

    setMode(mode: string) {}
}
