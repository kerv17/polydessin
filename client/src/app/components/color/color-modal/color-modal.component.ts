import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ColorService } from '@app/services/color/color.service';

@Component({
  selector: 'app-color-modal',
  templateUrl: './color-modal.component.html',
  styleUrls: ['./color-modal.component.scss']
})
export class ColorModalComponent implements OnInit {

  public hue : string;
  public color : string;

  @Output()
  isVisible: EventEmitter<boolean> = new EventEmitter(true);

  @Output()
  colorModified: EventEmitter<string> = new EventEmitter(true);

  constructor(private colorService : ColorService) {

  }

  ngOnInit(): void {
    if (this.colorService.currentColor == 'Primary'){
      this.color = this.colorService.primaryColor;
    }
    else if (this.colorService.currentColor == 'Secondary'){
      this.color = this.colorService.secondaryColor;
    }
    this.setColor();
  }

  confirmColor() : void {
    if (this.colorService.currentColor == 'Primary'){
      this.colorService.saveColor(this.colorService.primaryColor);
      this.colorService.primaryColor = this.color;
    } 
    else if (this.colorService.currentColor == 'Secondary'){
      this.colorService.saveColor(this.colorService.secondaryColor);
      this.colorService.secondaryColor = this.color;
    }
    this.colorModified.emit(this.color);
    this.isVisible.emit(false);
  }

  cancel() : void {
    this.isVisible.emit(false);
  }

  setColor() : void {
    let subColor:string = this.color.substring(5,this.color.length - 1);
    let splitColor:string[] = subColor.split(",");

    (<HTMLInputElement>document.getElementById("R")).value = parseInt(splitColor[0]).toString(16);
    (<HTMLInputElement>document.getElementById("G")).value = parseInt(splitColor[1]).toString(16);
    (<HTMLInputElement>document.getElementById("B")).value = parseInt(splitColor[2]).toString(16);
    (<HTMLInputElement>document.getElementById("A")).value = String(parseFloat(splitColor[3])*100);
  }

  updateColor() : void {
    //récupérer valeur input
    let R:string = (<HTMLInputElement>document.getElementById("R")).value;
    let G:string = (<HTMLInputElement>document.getElementById("G")).value;
    let B:string = (<HTMLInputElement>document.getElementById("B")).value;
    let A:string = (<HTMLInputElement>document.getElementById("A")).value;

    //vérifie si hexadécimal
    //update la couleur rgba
    if (this.colorService.isHexadecimal(R) && this.colorService.isHexadecimal(G) && this.colorService.isHexadecimal(B)){
      if (A != null && Number(A) >= 0 && Number(A) < 100){
        this.color = 'rgba(' + parseInt(R, 16) + ',' + parseInt(G, 16) + ',' + parseInt(B, 16) + ',' + (Number(A)/100.0) + ')';
        
      }
      else if (Number(A) > 100){
        (<HTMLInputElement>document.getElementById("A")).value = "100";
      }
      else {
        this.color = 'rgba(' + parseInt(R, 16) + ',' + parseInt(G, 16) + ',' + parseInt(B, 16) + ',1)';
        this.hue = this.color;
      }
      
    } 
    else {
      this.setColor();
    }
  }
  
}
