import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    pile: DrawAction[];
    currentLocation: number = 0;

    constructor() {
        this.pile = [{} as DrawAction];

        /*
        To avoid using recursive dependencies, we should look into
        using events to send actions from tools to this service.

        I do not know yet how custom events work, but it is worth looking into
        */
        addEventListener('action',(event:CustomEvent)=>{ this.addAction(event.detail)});
        addEventListener('keypress',(event:KeyboardEvent)=>{this.onKeyPress(event)});
    }

    onKeyPress(event: KeyboardEvent):void {
      if (event.key =='z' && event.ctrlKey){this.undo();}
      if (event.key =='y' && event.ctrlKey){this.redo();}

    }

    undo(): void {
        if(this.currentLocation> 0){
        this.currentLocation--;

        const drawingService:DrawingService = this.pile[1].tool.drawingService;
        drawingService.resetCanvas();
        for (let i = 1;i<=this.currentLocation;i++){
          this.doAction(this.pile[i]);
        }
        console.log(this.pile, this.currentLocation);
      }
    }

    redo(): void {
        this.currentLocation++;
        const action = this.pile[this.currentLocation];
        action.tool.doAction(action);

        console.log(this.pile, this.currentLocation);
    }


    addAction(action: DrawAction): void {
        console.log(action);
        if (this.currentLocation < this.pile.length-1) {
            this.pile = this.pile.slice(0, this.currentLocation+1);
        }
        this.pile.push(action);
        this.currentLocation++;
        console.log(this.pile, this.currentLocation);
    }

    doAction(action: DrawAction): void {
      if (action.canvas === undefined){
          let tool = action.tool;
          tool.doAction(action);
      }
    }
}

export interface DrawAction {
    tool: Tool;
    toolMode: string;
    colors: string[]; // Colors at moment of action
    widths: number[]; // List of widths (for aersol: width, radius and sprayAmount)
    points: Vec2[]; // List of relevant points (size may vary)
    canvas: CanvasRenderingContext2D;
}

