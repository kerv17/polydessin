import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import * as Globals from '@app/Constants/constants';
import { EllipsisService } from '@app/services/tools/ToolServices/ellipsis-service';
import { LineService } from '@app/services/tools/ToolServices/line-service';
import { PencilService } from '@app/services/tools/ToolServices/pencil-service';
import { RectangleService } from '@app/services/tools/ToolServices/rectangle-service';
@Injectable({
    providedIn: 'root',
})
export class ToolControllerService {
    currentTool: Tool;
    toolMap: Map<string, Tool> = new Map();
    private EscapeIsDown:boolean = false;
    private BackspaceIsDown:boolean = false;

    functionMap:Map<string,Function> = new Map();
    constructor(
        private pencilService: PencilService,
        private rectangleService: RectangleService,
        private lineService: LineService,
        private ellipsisService: EllipsisService,
    ) {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.checkKeyEvent(event);
        });
        document.addEventListener('keyup', (event: KeyboardEvent) => {
            this.checkKeyEvent(event);
        });
        this.initMap();
        this.currentTool = pencilService;
    }
    initMap(): void {
        this.toolMap
            .set(Globals.crayonShortcut, this.pencilService)
            .set(Globals.lineShortcut, this.lineService)
            .set(Globals.rectangleShortcut, this.rectangleService)
            .set(Globals.ellipsisShortcut, this.ellipsisService);

        this.functionMap
            .set(Globals.shiftShortcut,(event:KeyboardEvent) => { this.shift(event.type)})
            .set(Globals.EscapeShortcut,(event:KeyboardEvent)=>{this.escape(event.type)})
            .set(Globals.BackSpaceShortcut,(event:KeyboardEvent)=>{this.backspace(event.type)});
    }

    setTool(shortcut: string): void {
        const tempTool: Tool | undefined = this.toolMap.get(shortcut);
        if (tempTool != undefined) this.currentTool = tempTool;
    }

    shift(eventType: string): void {

        this.currentTool.onShift(eventType === 'keydown');
    }
    escape(eventType: string): void{
        if (eventType === 'keydown'){
          if(!this.EscapeIsDown) {this.currentTool.onEscape();}
          this.EscapeIsDown = true;
        }
        else {this.EscapeIsDown = false;}
    }
    backspace(eventType: string): void{
      if (eventType === 'keydown'){
        if (!this.BackspaceIsDown){this.currentTool.onBackspace();}
        this.BackspaceIsDown = true;
      } else { this.BackspaceIsDown = false;}
    }

    setFill(): void {
        this.currentTool.toolMode = 'fill';
    }

    setBorder(): void {
        this.currentTool.toolMode = 'border';
    }
    setFillBorder(): void {
        this.currentTool.toolMode = 'fillBorder';
    }
    // TODO changer ca
    private checkKeyEvent(event: KeyboardEvent): void {
        if (this.toolMap.has(event.key)){
          let tool:Tool | undefined = this.toolMap.get(event.key)
          if (tool !== undefined ){this.currentTool = tool;}
          return;
        }
        if(this.functionMap.has(event.key)){
          let functionToCall:Function | undefined = this.functionMap.get(event.key);
          if (functionToCall !== undefined){functionToCall.call(this,event);}
          return;
        }

    }
}
