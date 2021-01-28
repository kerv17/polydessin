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

  constructor(private colorService : ColorService) {
    
  }

  ngAfterViewInit(): void {
    this.primaryColor = this.colorService.primaryColor;
    this.secondaryColor = this.colorService.secondaryColor;
    this.visibility = this.colorService.modalVisibility; //trouver alternative
  }

  invert(){
    let tempColor:string = this.primaryColor;
    this.primaryColor = this.secondaryColor;
    this.secondaryColor = tempColor;
  }

  openModal(color : string) : void {
    this.colorService.modalVisibility = true;
    this.colorService.currentColor = color;
    this.visibility = this.colorService.modalVisibility; //trouver alternative (2-way binding)
  }



  

  /*

  updateColor():void{
    let subPrimary:string = this.primaryColor.substring(5,this.primaryColor.length - 1);
    let splitPrimary:string[] = subPrimary.split(",");

    let subSecondary:string = this.secondaryColor.substring(5,this.secondaryColor.length - 1);
    let splitSecondary:string[] = subSecondary.split(",");
    

    (<HTMLInputElement>document.getElementById("RP")).value = splitPrimary[0];
    (<HTMLInputElement>document.getElementById("VP")).value = splitPrimary[1];
    (<HTMLInputElement>document.getElementById("BP")).value = splitPrimary[2];
    (<HTMLInputElement>document.getElementById("opacityP")).value = splitPrimary[3];
    (<HTMLInputElement>document.getElementById("RS")).value = splitSecondary[0];
    (<HTMLInputElement>document.getElementById("VS")).value = splitSecondary[1];
    (<HTMLInputElement>document.getElementById("BS")).value = splitSecondary[2];
    (<HTMLInputElement>document.getElementById("opacityS")).value = splitSecondary[3];
  }

  setColor(): void {
    let RP:string = (<HTMLInputElement>document.getElementById("RP")).value;
    let VP:string = (<HTMLInputElement>document.getElementById("VP")).value;
    let BP:string = (<HTMLInputElement>document.getElementById("BP")).value;
    let opacityP:string = (<HTMLInputElement>document.getElementById("opacityP")).value;
    let RS:string = (<HTMLInputElement>document.getElementById("RS")).value;
    let VS:string = (<HTMLInputElement>document.getElementById("VS")).value;
    let BS:string = (<HTMLInputElement>document.getElementById("BS")).value;
    let opacityS:string = (<HTMLInputElement>document.getElementById("opacityS")).value;

    if (RP != null && VP != null && BP != null){
      if (opacityP != null){
        this.primaryColor = 'rgba(' + RP + ',' + VP + ',' + BP + ',' + opacityP + ')';
      }
      else {
        this.primaryColor = 'rgba(' + RP + ',' + VP + ',' + BP + ',1)';
      }
      
    }

    if (RS != null && VS != null && BS != null){
      if (opacityS != null){
        this.secondaryColor = 'rgba(' + RS + ',' + VS + ',' + BS + ',' + opacityS + ')';
      }
      else {
        this.secondaryColor = 'rgba(' + RS + ',' + VS + ',' + BS + ',1)';
      }
      
    }
    this.updateDrawingColor();
    this.updateColor();
    
  }*/

}
