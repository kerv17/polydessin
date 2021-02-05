import { Component, HostListener } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
<<<<<<< HEAD
    public visible = false;
    public width: boolean = false;
=======
    visible = false;
    width: boolean = false;
    fillBorder: boolean = false;

>>>>>>> origin/dev
    constructor(private service: ToolControllerService, private drawing: DrawingService) {}

    openCrayon() {
        this.setBackgroundColor('crayon');
        this.service.setTool();
<<<<<<< HEAD
=======
        this.fillBorder = false;
>>>>>>> origin/dev
        this.openWidth();
    }
    openRectangle() {
        this.service.setRectangle();
        this.setBackgroundColor('rectangle');
<<<<<<< HEAD
=======
        this.fillBorder = true;
        this.openWidth();
>>>>>>> origin/dev
    }

    openLine() {
        this.service.setLine();
        this.setBackgroundColor('line');
<<<<<<< HEAD
=======
        this.fillBorder = false;
        this.openWidth();
>>>>>>> origin/dev
    }

    openEllipsis() {
        this.service.setEllipse();
        this.setBackgroundColor('ellipsis');
<<<<<<< HEAD
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
=======
        this.fillBorder = true;
        this.openWidth();
    }
    setBackgroundColor(name: string): void {
        const crayon: HTMLElement | null = document.getElementById('CrayonButton');
        const rectangle: HTMLElement | null = document.getElementById('RectangleButton');
        const line: HTMLElement | null = document.getElementById('LineButton');
        const ellipsis: HTMLElement | null = document.getElementById('EllipsisButton');

        const fill: HTMLElement | null = document.getElementById('fillButton');
        const border: HTMLElement | null = document.getElementById('borderButton');
        const fillBorder: HTMLElement | null = document.getElementById('fillBorderButton');

        if (name == 'crayon' || name == 'rectangle' || name == 'line' || name == 'ellipsis') {
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
        } else if (name == 'fill' || name == 'border' || name == 'fillBorder') {
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
>>>>>>> origin/dev
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

<<<<<<< HEAD
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

=======
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

>>>>>>> origin/dev
    @HostListener('window:keydown', ['$event'])
    onKeyPress($event: KeyboardEvent) {
        if (($event.ctrlKey || $event.metaKey) && $event.key == '0') this.nouveauDessin();
    }

    setMode(mode: string) {}
}
