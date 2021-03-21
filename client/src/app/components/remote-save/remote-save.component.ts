import { Component } from '@angular/core';
import { RemoteSaveService } from '@app/services/remote-save/remote-save.service';
import { CanvasInformation } from '@common/communication/canvas-information';
@Component({
    selector: 'app-remote-save',
    templateUrl: './remote-save.component.html',
    styleUrls: ['./remote-save.component.scss'],
})
export class RemoteSaveComponent {
    png: string = 'png';
    jpeg: string = 'jpeg';
    saveMode: string;
    fileName: string;
    tagsName: string;
    inSave: boolean = false;
    constructor(private remoteSaveService: RemoteSaveService) {}

    toggleMode(mode: string): void {
        this.saveMode = mode;
    }
    savePicture(): void {
        const tags: string[] = this.remoteSaveService.tagsHangler(this.tagsName);

        const information = { name: this.fileName, tags, format: this.saveMode, width: 0, height: 0, imageData: '' } as CanvasInformation;

        this.inSave = true;
        this.remoteSaveService.post(information);
        this.inSave = false;
    }
    close(): void {
        this.remoteSaveService.showModalSave = false;
    }
}
