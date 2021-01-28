import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  public primaryColor : string;
  public secondaryColor : string;
  public currentColor : string;
  public modalVisibility : boolean;

  constructor() { 
    this.primaryColor = "rgba(0,0,0,1)";
    this.secondaryColor = "rgba(0,0,0,1)";
    this.modalVisibility = false;
  }
}
