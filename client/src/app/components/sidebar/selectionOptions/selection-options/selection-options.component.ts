import { Component } from '@angular/core';
import * as Globals from '@app/Constants/constants';
import { SelectionService } from '@app/services/tools/ToolServices/selection.service';

@Component({
    selector: 'app-selection-options',
    templateUrl: './selection-options.component.html',
    styleUrls: ['./selection-options.component.scss'],
})
export class SelectionOptionsComponent {
    copyStyle: { [key: string]: string };
    pasteStyle: { [key: string]: string };

    constructor(public selectionService: SelectionService) {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.checkKeyEvent(event);
        });
    }

    // transformer en map
    private checkKeyEvent(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === Globals.COPY_SHORTCUT) {
            this.selectionService.copy();
        } else if (event.ctrlKey && event.key === Globals.PASTE_SHORTCUT) {
            this.selectionService.paste();
        } else if (event.ctrlKey && event.key === Globals.CUT_SHORTCUT) {
            this.selectionService.cut();
        } else if (event.key === Globals.DELETE_SHORTCUT) {
            this.selectionService.delete();
        }
    }
}
