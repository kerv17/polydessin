import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ColorService } from '@app/services/color/color.service';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements AfterViewInit {

  public primaryColor: string;
  public secondaryColor: string;
  public visibility : boolean;
  public recentColors : string[] = new Array();

  @ViewChild('OP') OP:ElementRef;
  @ViewChild('OS') OS:ElementRef;

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
    if (this.primaryColor != undefined){
      let opacity:string = this.OP.nativeElement.value;
      if (parseFloat(opacity) > 100){
        opacity = '100';
        this.OP.nativeElement.value = '100';
      } 
      else {
        opacity = (parseFloat(opacity)/100.0).toString();
      }
      let subColor:string = this.primaryColor.substring(5,this.primaryColor.length - 1);
      let splitColor:string[] = subColor.split(",");
      this.primaryColor = 'rgba(' + splitColor[0] + ',' + splitColor[1] + ',' + splitColor[2] + ',' + opacity +')';
      this.colorService.primaryColor = this.primaryColor;
    }
    
  }

  updateOpacitySecondary(){
    if (this.secondaryColor != undefined){
      let opacity:string = this.OS.nativeElement.value;
      if (parseFloat(opacity) > 100){
        opacity = '100';
        this.OS.nativeElement.value = '100';
      } 
      else {
        opacity = (parseFloat(opacity)/100.0).toString();
      }
      let subColor:string = this.secondaryColor.substring(5,this.secondaryColor.length - 1);
      let splitColor:string[] = subColor.split(",");
      this.secondaryColor = 'rgba(' + splitColor[0] + ',' + splitColor[1] + ',' + splitColor[2] + ',' + opacity +')';
      this.colorService.secondaryColor = this.secondaryColor;
    }
    
  }

  setOpacityValue(){
    if (this.primaryColor != undefined){
      let subColorP:string = this.primaryColor.substring(5,this.primaryColor.length - 1);
      let splitColorP:string[] = subColorP.split(",");
      this.OP.nativeElement.value = (parseFloat(splitColorP[3])*100).toString();
    }

    if (this.secondaryColor != undefined){
      let subColorS:string = this.secondaryColor.substring(5,this.secondaryColor.length - 1);
      let splitColorS:string[] = subColorS.split(",");
      this.OS.nativeElement.value = (parseFloat(splitColorS[3])*100).toString();
    }

  }

}
