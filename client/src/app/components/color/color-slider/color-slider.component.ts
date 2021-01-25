import {
  AfterViewInit, Component,
  ElementRef,
  EventEmitter, HostListener, Output, ViewChild
} from '@angular/core';

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
  Left = 0,
  Middle = 1,
  Right = 2,
  Back = 3,
  Forward = 4,
}


@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss'],
})
export class ColorSliderComponent implements AfterViewInit {
  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>

  @Output()
    primaryColor: EventEmitter<string> = new EventEmitter(true);

    @Output()
    secondaryColor: EventEmitter<string> = new EventEmitter(true);

  private ctx: CanvasRenderingContext2D
  private mousedown: boolean = false
  private selectedHeight: number

  ngAfterViewInit() {
    this.draw()
  }

  draw() {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext("2d") as CanvasRenderingContext2D;
    }
    const width = this.canvas.nativeElement.width
    const height = this.canvas.nativeElement.height

    this.ctx.clearRect(0, 0, width, height)

    const gradient = this.ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)')
    gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)')
    gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)')
    gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)')
    gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)')
    gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)')
    gradient.addColorStop(1, 'rgba(255, 0, 0, 1)')

    this.ctx.beginPath()
    this.ctx.rect(0, 0, width, height)

    this.ctx.fillStyle = gradient
    this.ctx.fill()
    this.ctx.closePath()

    if (this.selectedHeight) {
      this.ctx.beginPath()
      this.ctx.strokeStyle = 'white'
      this.ctx.lineWidth = 5
      this.ctx.rect(0, this.selectedHeight - 5, width, 10)
      this.ctx.stroke()
      this.ctx.closePath()
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) {
    this.mousedown = false
  }

  onMouseDown(evt: MouseEvent) {
    this.mousedown = true
    this.selectedHeight = evt.offsetY
    this.draw()
    if (evt.button === MouseButton.Left){
      this.emitColor(evt.offsetX, evt.offsetY, MouseButton.Left)
    }
    else if (evt.button === MouseButton.Right){
      this.emitColor(evt.offsetX, evt.offsetY, MouseButton.Right)
    }
    
  }

  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.selectedHeight = evt.offsetY
      this.draw()
      if (evt.button === MouseButton.Left){
        this.emitColor(evt.offsetX, evt.offsetY, MouseButton.Left)
      }
      else if (evt.button === MouseButton.Right){
        this.emitColor(evt.offsetX, evt.offsetY, MouseButton.Left)
      }
      
    }
  }

  emitColor(x: number, y: number, side : number) {
    const rgbaColor = this.getColorAtPosition(x, y)
    if(side == MouseButton.Left){
      sessionStorage.setItem('primaryColor', rgbaColor);
      this.primaryColor.emit(rgbaColor);
    }
    else if(side == MouseButton.Right){
      sessionStorage.setItem('secondaryColor', rgbaColor);
      this.secondaryColor.emit(rgbaColor);
    }
  }

  getColorAtPosition(x: number, y: number) {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data
    return (
      'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)'
    )
  }
}