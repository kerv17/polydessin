import { Component, HostListener, ViewChild } from '@angular/core';
import { RemoteSaveService } from '@app/services/remote-save/remote-save.service';

@Component({
  selector: 'app-remote-save',
  templateUrl: './remote-save.component.html',
  styleUrls: ['./remote-save.component.scss']
})

export class RemoteSaveComponent implements AfterViewInit {
  png: string = 'png';
  jpeg: string = 'jpeg';
  saveMode: string;
  width: number;
  height: number;
  filtre: string = 'none';
  fileName: string = 'canvas';  
  constructor(private remoteSaveService: RemoteSaveService) {}
  ngAfterViewInit(): void {}

  toggleMode(mode: string): void {
    this.saveMode = mode;
  } 
  savePicture(): void {
    this.remoteSaveService.exportImage(this.exportMode, this.fileName);
}
  close(): void {
    this.remoteSaveService.showModalSave = false;
  }

}