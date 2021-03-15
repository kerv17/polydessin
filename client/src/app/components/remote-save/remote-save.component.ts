import { Component } from '@angular/core';
import { RemoteSaveService } from '@app/services/remote-save/remote-save.service';

@Component({
  selector: 'app-remote-save',
  templateUrl: './remote-save.component.html',
  styleUrls: ['./remote-save.component.scss']
})

export class RemoteSaveComponent {
  png: string = 'png';
  jpeg: string = 'jpeg';
  saveMode: string;
  width: number;
  height: number;
  fileName: string = 'canvas';  
  constructor(private remoteSaveService: RemoteSaveService) {}

  toggleMode(mode: string): void {
    this.saveMode = mode;
  } 
  savePicture(): void {
    this.remoteSaveService.post();
}
  close(): void {
    this.remoteSaveService.showModalSave = false;
  }

}