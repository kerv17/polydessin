import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  public primaryColor : string = 'rgba(0,0,0,1)';
  public secondaryColor : string = 'rgba(0,0,0,1)';
  public currentColor : string;
  public modalVisibility : boolean;
  public recentColors : string[] = new Array();

  constructor() { 
    this.modalVisibility = false;
  }

  isHexadecimal(value:string) : boolean {
    if (value.length == 2){
      let num:number = parseInt(value, 16);
      if (num >= 10 && num <= 255){
        return true;
      }
    }
    else if (value.length == 1){
      let num:number = parseInt(value, 16);
      if (num >= 0 && num <= 9){
        return true;
      }
    }
    return false;
  }

  saveColor(color:string){
    if (this.recentColors.length < 10){
      this.recentColors.push(color);
    }
    else {
      this.recentColors.shift();
      this.recentColors.push(color);
    }
  }
}
