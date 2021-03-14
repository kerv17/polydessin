import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import * as Globals from '@app/Constants/constants';
import { CarouselService } from '@app/services/Carousel/carousel.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportService } from '@app/services/export/export.service';
import { ToolControllerService } from '@app/services/tools/ToolController/tool-controller.service';
import { UndoRedoService } from '@app/services/tools/undoRedo/undo-redo.service';

type ToolParam = {
    showWidth: boolean;
    toolName: string;
};

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    showWidth: boolean = false;
    showAerosol: boolean = false;
    shapeOptions: boolean = false;
    showline: boolean = false;
    currentTool: string;
    resetAttributes: boolean = false;

    undo: { backgroundColor: string } = Globals.BACKGROUND_DARKGREY;
    redo: { backgroundColor: string } = Globals.BACKGROUND_DARKGREY;
    private toolParamMap: Map<string, ToolParam>;
    private functionMap: Map<string, () => void>;

    constructor(
        private toolcontroller: ToolControllerService,
        private drawing: DrawingService,
        private router: Router,
        private colorService: ColorService,
        public exportService: ExportService,
        public carouselService: CarouselService,
        private undoRedoService: UndoRedoService,
    ) {
        this.colorService.resetColorValues();
        this.toolcontroller.resetWidth();
        this.toolParamMap = new Map();
        this.functionMap = new Map();
        this.initToolMap();
        this.initFunctionMap();
        this.currentTool = Globals.CRAYON_SHORTCUT;

        addEventListener('undoRedoState', (event: CustomEvent) => {
            this.undo = event.detail[0] ? Globals.BACKGROUND_WHITE : Globals.BACKGROUND_DARKGREY;
            this.redo = event.detail[1] ? Globals.BACKGROUND_WHITE : Globals.BACKGROUND_DARKGREY;
        });
    }
    // TODO REFACTOR ALL TOOLS
    goBack(): void {
        this.router.navigate(['..']);
        this.resetDrawingAttributes();
    }
    resetDrawingAttributes(): void {
        this.colorService.resetColorValues();
        this.toolcontroller.resetWidth();
    }
    setTool(tool: string): void {
        this.toolcontroller.setTool(tool);
    }

    selectCanvas(): void {
        this.toolcontroller.selectionService.selectCanvas(this.drawing.canvas.width, this.drawing.canvas.height);
    }
    openCarousel(): void {
        this.carouselService.showCarousel = true;
    }
    openSelection(): void {
        this.toolcontroller.setTool(Globals.RECTANGLE_SELECTION_SHORTCUT);
    }
    showAerosolInterface(): void {
        this.showAerosol = this.currentTool === Globals.AEROSOL_SHORTCUT;
    }
    showLineOptions(): void {
        this.showline = this.currentTool === Globals.LINE_SHORTCUT;
    }
    showShapeOptions(): void {
        this.shapeOptions = this.currentTool === Globals.RECTANGLE_SHORTCUT || this.currentTool === Globals.ELLIPSIS_SHORTCUT;
    }
    openTool(showWidth: boolean, toolname: string): void {
        this.showWidth = showWidth;
        this.resetAttributes = !this.resetAttributes;
        this.currentTool = toolname;

        this.showLineOptions();
        this.showAerosolInterface();
        this.showShapeOptions();
        if (this.toolcontroller.selectionService.inSelection) {
            this.toolcontroller.selectionService.onEscape();
        }
    }

    newCanvas(): void {
        this.colorService.resetColorValues();
        this.toolcontroller.resetWidth();
        this.toolcontroller.resetToolsMode();
        this.drawing.newCanvas();
        this.toolcontroller.lineService.clearPath();
        this.currentTool = Globals.CRAYON_SHORTCUT;
    }

    @HostListener('window:keydown', ['$event'])
    onKeyPress($event: KeyboardEvent): void {
        if (!this.exportService.showModalExport && !this.carouselService.showCarousel) {
            if (this.functionMap.has([$event.ctrlKey, $event.key].join())) {
                this.functionMap.get([$event.ctrlKey, $event.key].join())?.call(this);
                $event.preventDefault();
            }

            if (this.toolcontroller.focused) {
                this.handleShortcuts($event);
                $event.preventDefault();
            }
        }
    }
    openExport(): void {
        this.exportService.showModalExport = true;
    }

    initToolMap(): void {
        this.toolParamMap
            .set([false, Globals.CRAYON_SHORTCUT].join(), { showWidth: true, toolName: Globals.CRAYON_SHORTCUT } as ToolParam)
            .set([false, Globals.LINE_SHORTCUT].join(), { showWidth: true, toolName: Globals.LINE_SHORTCUT } as ToolParam)
            .set([false, Globals.RECTANGLE_SHORTCUT].join(), { showWidth: true, toolName: Globals.RECTANGLE_SHORTCUT } as ToolParam)
            .set([false, Globals.ELLIPSIS_SHORTCUT].join(), { showWidth: true, toolName: Globals.ELLIPSIS_SHORTCUT } as ToolParam)
            .set([false, Globals.AEROSOL_SHORTCUT].join(), { showWidth: true, toolName: Globals.AEROSOL_SHORTCUT } as ToolParam)
            .set([false, Globals.RECTANGLE_SELECTION_SHORTCUT].join(), {
                showWidth: false,
                toolName: Globals.RECTANGLE_SELECTION_SHORTCUT,
            } as ToolParam);
    }
    initFunctionMap(): void {
        this.functionMap
            .set([true, Globals.NEW_DRAWING_EVENT].join(), this.newCanvas)
            .set([true, Globals.EXPORT_SHORTCUT].join(), this.openExport)
            .set([true, Globals.CAROUSEL_SHORTCUT].join(), this.openCarousel)
            .set([true, Globals.CANVAS_SELECTION_EVENT].join(), this.selectCanvas)
            .set([false, Globals.CRAYON_SHORTCUT].join(), this.openSelection);
    }

    handleShortcuts(event: KeyboardEvent): void {
        const key: string = [event.ctrlKey, event.key].join();
        const currentToolOptions = this.toolParamMap.get(key);
        if (currentToolOptions != undefined) {
            this.setTool(currentToolOptions.toolName);
            this.openTool(currentToolOptions.showWidth, currentToolOptions.toolName);
        }
    }

    undoAction(): void {
        this.undoRedoService.undo();
    }

    redoAction(): void {
        this.undoRedoService.redo();
    }
}
