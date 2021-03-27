import { Component } from '@angular/core';
import * as Globals from '@app/Constants/constants';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';

@Component({
    selector: 'app-selection-options',
    templateUrl: './selection-options.component.html',
    styleUrls: ['./selection-options.component.scss'],
})
export class SelectionOptionsComponent {
    constructor(private toolControllerService: ToolControllerService) {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.checkKeyEvent(event);
        });
    }

    // transformer en map
    private checkKeyEvent(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === Globals.COPY_SHORTCUT) {
            this.toolControllerService.selectionService.copy();
        } else if (event.ctrlKey && event.key === Globals.PASTE_SHORTCUT) {
            if (this.toolControllerService.currentTool !== this.toolControllerService.selectionService) {
                this.toolControllerService.setTool(Globals.RECTANGLE_SELECTION_SHORTCUT);
            }
            this.toolControllerService.selectionService.paste();
        } else if (event.ctrlKey && event.key === Globals.CUT_SHORTCUT) {
            this.toolControllerService.selectionService.cut();
        } else if (event.key === Globals.DELETE_SHORTCUT) {
            this.toolControllerService.selectionService.delete();
        }
    }
}
