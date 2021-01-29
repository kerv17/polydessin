import { AfterViewInit, Component } from '@angular/core';
import { ColorService } from '@app/services/color/color.service';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements AfterViewInit {

  public primaryColor: string
  public secondaryColor: string
  public visibility : boolean;
  public recentColors : string[];

  constructor(private colorService : ColorService) {
    
  }

  ngAfterViewInit(): void {
    this.updateColor();
    this.visibility = this.colorService.modalVisibility;
    this.recentColors = this.colorService.recentColors;
    this.setOpacityValue();
  }

  invert(){
    let tempColor:string = this.primaryColor;
    this.primaryColor = this.secondaryColor;
    this.secondaryColor = tempColor;

    this.colorService.primaryColor = this.primaryColor;
    this.colorService.secondaryColor = this.secondaryColor;
    this.setOpacityValue();
  }

  openModal(color : string) : void {
    this.colorService.modalVisibility = true;
    this.colorService.currentColor = color;
    this.visibility = this.colorService.modalVisibility;
  }

  closeModal(){
    this.visibility = false;
    this.setOpacityValue();
  }

  updateColor(){
    this.primaryColor = this.colorService.primaryColor;
    this.secondaryColor = this.colorService.secondaryColor;
  }

  selectPrimaryColor(color : string){
    this.colorService.saveColor(this.primaryColor);
    this.primaryColor = color;
    this.colorService.primaryColor = this.primaryColor;
  }

  selectSecondaryColor(color : string){
    this.colorService.saveColor(this.secondaryColor);
    this.secondaryColor = color;
    this.colorService.secondaryColor = this.secondaryColor;
  }

  updateOpacityPrimary(){
    let opacity:string = (<HTMLInputElement>document.getElementById("OP")).value; //à changer avec ngClass
    opacity = (parseFloat(opacity)/100.0).toString();
    let subColor:string = this.primaryColor.substring(5,this.primaryColor.length - 1);
    let splitColor:string[] = subColor.split(",");
    this.primaryColor = 'rgba(' + splitColor[0] + ',' + splitColor[1] + ',' + splitColor[2] + ',' + opacity +')';
    this.colorService.primaryColor = this.primaryColor;
  }

  updateOpacitySecondary(){
    let opacity:string = (<HTMLInputElement>document.getElementById("OS")).value; //à changer avec ngClass
    opacity = (parseFloat(opacity)/100.0).toString();
    let subColor:string = this.secondaryColor.substring(5,this.secondaryColor.length - 1);
    let splitColor:string[] = subColor.split(",");
    this.secondaryColor = 'rgba(' + splitColor[0] + ',' + splitColor[1] + ',' + splitColor[2] + ',' + opacity +')';
    this.colorService.secondaryColor = this.secondaryColor;
  }

  setOpacityValue(){
    let subColorP:string = this.primaryColor.substring(5,this.primaryColor.length - 1);
    let splitColorP:string[] = subColorP.split(",");
    (<HTMLInputElement>document.getElementById("OP")).value = (parseFloat(splitColorP[3])*100).toString(); //à changer avec ngClass
    
    let subColorS:string = this.secondaryColor.substring(5,this.secondaryColor.length - 1);
    let splitColorS:string[] = subColorS.split(",");
    (<HTMLInputElement>document.getElementById("OS")).value = (parseFloat(splitColorS[3])*100).toString(); //à changer avec ngClass
  }

}
