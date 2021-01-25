import { Component } from '@angular/core';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    public visible = false;
    public crayon: boolean = false;
    constructor(private service: ToolControllerService) {}
    openColor() {
        this.visible = true;
    }

    openCrayon() {
        this.service.setTool();
    }
}
