import { Component } from '@angular/core';
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
        this.service.setTool();
        this.openWidth();
    }
    openWidth() {
        this.width = true;
        this.visible = false;
    }
    nouveauDessin() {
        //Doit vérifier si la surface est vide ou non
        let image: ImageData = this.drawing.baseCtx.getImageData(0, 0, this.drawing.canvas.width, this.drawing.canvas.height);
        if (this.notWhiter(image)) {
            // window.alert(image.data.find(this.notWhite));
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

    notWhiter(image: ImageData): boolean {
        window.alert(image.data[0]);
        if (image.data[1] != undefined) {
            for (let i = 0; i < image.data.length; i += 4) {
                if (image.data[i] != 255 || image.data[i + 1] != 255 || image.data[i + 2] != 255) {
                    return true;
                }
            }
        }
        return false;
    }
}
