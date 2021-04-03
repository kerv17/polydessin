import { Component } from '@angular/core';
import * as Globals from '@app/Constants/constants';
import { ClipboardService } from '@app/services/tools/ToolServices/clipboard/clipboard.service';

@Component({
    selector: 'app-selection-options',
    templateUrl: './selection-options.component.html',
    styleUrls: ['./selection-options.component.scss'],
})
export class SelectionOptionsComponent {
    copyStyle: { [key: string]: string };
    pasteStyle: { [key: string]: string };

    constructor(public clipboardService: ClipboardService) {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.checkKeyEvent(event);
        });
    }

    // transformer en map
    private checkKeyEvent(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === Globals.COPY_SHORTCUT) {
            this.clipboardService.copy();
        } else if (event.ctrlKey && event.key === Globals.PASTE_SHORTCUT) {
            this.clipboardService.paste();
        } else if (event.ctrlKey && event.key === Globals.CUT_SHORTCUT) {
            this.clipboardService.cut();
        } else if (event.key === Globals.DELETE_SHORTCUT) {
            this.clipboardService.delete();
        }
    }
}
