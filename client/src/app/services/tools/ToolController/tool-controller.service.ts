import { Injectable } from '@angular/core';
import { AppModule } from '@app/app.module';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '../pencil-service';

@Injectable({
    providedIn: 'root',
})
export class ToolControllerService {
    public currentTool: Tool;
    constructor() {}

    public setTool(): Tool {
        this.currentTool = AppModule.injector.get(PencilService);

        return new PencilService(new DrawingService());
    }
}
