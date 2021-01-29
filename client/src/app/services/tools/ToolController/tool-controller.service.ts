import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { PencilService } from '../ToolServices/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class ToolControllerService {
    public currentTool: Tool;
    constructor(private pencilService: PencilService) {}

    public setTool(): void {
        this.currentTool = this.pencilService;
    }
}
