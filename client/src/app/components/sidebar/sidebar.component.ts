import { Component, HostListener } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    public visible = false;
    public width: boolean = false;
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
        let crayon: HTMLElement | null = document.getElementById('CrayonButton');
        let rectangle: HTMLElement | null = document.getElementById('RectangleButton');
        let line: HTMLElement | null = document.getElementById('LineButton');
        let ellipsis: HTMLElement | null = document.getElementById('EllipsisButton');

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
        this.visible = false;
    }
    //TODO à modifier
    nouveauDessin() {
        //Doit vérifier si la surface est vide ou non
        let image: ImageData = this.drawing.baseCtx.getImageData(0, 0, this.drawing.canvas.width, this.drawing.canvas.height);
        if (this.notWhiter(image)) {
            if (confirm('Are you sure you want to discard your current drawing?')) {
                this.drawing.clearCanvas(this.drawing.baseCtx);
                this.drawing.clearCanvas(this.drawing.previewCtx);
            }
        }
    }

    notWhite(element: number, index: number): boolean {
        if (index % 3 != 0) {
            //if (element != 255) window.alert(element);
            return element != 255 && element != 0;
        }
        return false;
    }

    // TODO à transférer
    notWhiter(image: ImageData): boolean {
        //window.alert(image.data[image.data.length - 3]);

        if (image.data[1] != undefined) {
            for (let i = 0; i < image.data.length; i += 4) {
                if (image.data[i] != 255 || image.data[i + 1] != 255 || image.data[i + 2] != 255) {
                    return true;
                }
            }
        }
        return false;
    }

    @HostListener('window:keydown', ['$event'])
    onKeyPress($event: KeyboardEvent) {
        if (($event.ctrlKey || $event.metaKey) && $event.key == '0') this.nouveauDessin();
    }

    setMode(mode: string) {}
}
