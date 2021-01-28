import { Component, OnInit } from '@angular/core';
import { ColorService } from '@app/services/color/color.service';

@Component({
  selector: 'app-color-modal',
  templateUrl: './color-modal.component.html',
  styleUrls: ['./color-modal.component.scss']
})
export class ColorModalComponent implements OnInit {

  public hue : string;
  public color : string;

  constructor(private colorService : ColorService) {

  }

  ngOnInit(): void {
    if (this.colorService.currentColor == "primary"){
      this.color = this.colorService.primaryColor;
    }
    else if (this.colorService.currentColor == "secondary"){
      this.color = this.colorService.secondaryColor;
    }
  }

  confirmColor() : void {
    if (this.colorService.currentColor == "primary"){
      this.colorService.primaryColor = this.color;
    } 
    else if (this.colorService.currentColor == "secondary"){
      this.colorService.secondaryColor = this.color;
    }

    this.colorService.modalVisibility = false;
  }

  cancel() : void {
    this.colorService.modalVisibility = false;
  }
  
}
