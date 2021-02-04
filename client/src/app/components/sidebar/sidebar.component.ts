import { Component } from '@angular/core';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    visible: boolean = false;
    width: boolean = false;
    constructor(private service: ToolControllerService) {}

    openCrayon(): void {
        this.service.setTool();
    }
    openRectangle(): void {
        this.service.setRectangle();
    }

    openLine(): void {
        this.service.setLine();
    }

    openEllipsis(): void {
        this.service.setEllipse();
    }
    openWidth(): void {
        this.width = true;
        this.visible = false;
    }

    setMode(mode: string): void {}
}
