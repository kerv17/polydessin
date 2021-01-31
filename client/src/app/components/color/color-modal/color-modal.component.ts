import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ColorService } from '@app/services/color/color.service';

@Component({
  selector: 'app-color-modal',
  templateUrl: './color-modal.component.html',
  styleUrls: ['./color-modal.component.scss']
})
export class ColorModalComponent implements AfterViewInit {

  public hue : string;
  public color : string;
  
  @ViewChild('R')  rValue:ElementRef;
  @ViewChild('G')  gValue:ElementRef;
  @ViewChild('B')  bValue:ElementRef;
  

  @Output()
  isVisible: EventEmitter<boolean> = new EventEmitter(true);

  @Output()
  colorModified: EventEmitter<string> = new EventEmitter(true);

  constructor(private colorService : ColorService) {
    
  }

  ngAfterViewInit(): void {
    if (this.colorService.currentColor == 'Primary'){
      this.color = this.colorService.primaryColor;
    }
    else if (this.colorService.currentColor == 'Secondary'){
      this.color = this.colorService.secondaryColor;
    }
    this.setColorInputValue();
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

  //affiche la valeur rgb de la couleur sélectionnée par la palette de couleur
  setColorInputValue() : void {
    if (this.color != undefined) {
      let subColor:string = this.color.substring(5,this.color.length - 1);
      let splitColor:string[] = subColor.split(",");
      
      this.rValue.nativeElement.value = parseInt(splitColor[0]).toString(16);
      this.gValue.nativeElement.value = parseInt(splitColor[1]).toString(16);
      this.bValue.nativeElement.value = parseInt(splitColor[2]).toString(16);
    } 
    else {
      this.rValue.nativeElement.value = '00';
      this.gValue.nativeElement.value = '00';
      this.bValue.nativeElement.value = '00';
    }
    
  }

  //met à jour la couleur lorsqu'on entre manuellement des valeurs rgb
  updateColorFromInput() : void {

    let R:string = this.rValue.nativeElement.value; 
    let G:string = this.gValue.nativeElement.value; 
    let B:string = this.bValue.nativeElement.value; 

    if (this.colorService.isHexadecimal(R) && this.colorService.isHexadecimal(G) && this.colorService.isHexadecimal(B)){
      
      this.color = 'rgba(' + parseInt(R, 16) + ',' + parseInt(G, 16) + ',' + parseInt(B, 16) + ',1)';
      this.hue = this.color;
        
    } 
    else {
      this.setColorInputValue();
    }
  }
  
}
