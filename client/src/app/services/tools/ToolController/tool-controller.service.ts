
import { Injectable} from '@angular/core';
import { Tool } from '@app/classes/tool';
import { PencilService } from '../ToolServices/pencil-service';
import { RectangleService} from "../ToolServices/rectangle-service";
import { LineService} from "../ToolServices/line-service";

@Injectable({
    providedIn: 'root',
})
export class ToolControllerService {
    public currentTool: Tool;
    constructor(
        private pencilService: PencilService,
        private rectangleService: RectangleService,
        private lineService:LineService) {
      document.addEventListener('keydown', (event:KeyboardEvent) => {
        this.checkKeyDown(event);

      });
    }

    public setTool(): void {
        this.currentTool = this.pencilService;
    }

    public setRectangle():void{
      this.currentTool = this.rectangleService;
    }

    public setLine():void{
      this.currentTool = this.lineService;
    }

    private checkKeyDown(event:KeyboardEvent):void{
      switch(event.key){
        case "c":
          this.setTool();
          break;
        case "1":
          this.setRectangle();
          break;
        case "l":
          this.setLine();
        case "Shift":
          break;
        default:
          break;
      }
      return;
    }




}
