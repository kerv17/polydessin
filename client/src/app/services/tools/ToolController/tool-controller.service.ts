
import { Injectable} from '@angular/core';
import { Tool } from '@app/classes/tool';
import { PencilService } from '../ToolServices/pencil-service';
import { RectangleService} from "../ToolServices/rectangle-service";
import { LineService} from "../ToolServices/line-service";
import { EllipsisService} from "../ToolServices/ellipsis-service";

@Injectable({
    providedIn: 'root',
})
export class ToolControllerService {
    public currentTool: Tool;
    public focused:boolean;

    constructor(
        private pencilService: PencilService,
        private rectangleService: RectangleService,
        private lineService:LineService,
        private ellipsisService:EllipsisService) {
      document.addEventListener('keydown', (event:KeyboardEvent) => {
        this.checkKeyDown(event);

      });
      document.addEventListener('keyup', (event:KeyboardEvent) => {
        this.checkKeyUp(event);

      });

      document.addEventListener('focusin', (event:FocusEvent) => {
        let target:Node = Object(event.target || event.currentTarget);
        if (target != null){
        if(target.nodeName == 'INPUT'){
          this.focused = false;
        }
        else{
          this.focused = true;
        }
          }
      });

      this.focused = true;
    }

    public setTool(): void {
        this.currentTool = this.pencilService;
    }

    public setRectangle():void{
      this.currentTool = this.rectangleService;
    }

    public setEllipse():void{
      this.currentTool = this.ellipsisService;
    }

    public setLine():void{
      this.currentTool = this.lineService;
    }
    public shift(shift:boolean){
      this.currentTool.onShift(shift);
    }


    private checkKeyDown(event:KeyboardEvent):void{
      if (this.focused){
      switch(event.key){
        case "c":
          this.setTool();
          break;
        case "1":
          this.setRectangle();
          break;
        case "2":
          this.setEllipse();
          break;2
        case "l":
          this.setLine();
          break;
        case "Shift":
          this.shift(true);
          break;
        default:
          break;
      }
    }
      return;
    }


    private checkKeyUp(event:KeyboardEvent):void{
      switch(event.key){
        case "Shift":
          this.shift(false);
          break;
        default:
          break;
      }
      return;
    }
}
