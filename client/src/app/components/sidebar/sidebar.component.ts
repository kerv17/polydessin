import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import * as Globals from '@app/Constants/constants';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportService } from '@app/services/export/export.service';
import { GridService } from '@app/services/grid/grid.service';
import { RemoteSaveService } from '@app/services/remote-save/remote-save.service';
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
    showWidth: boolean = true;
    showAerosol: boolean = false;
    shapeOptions: boolean = false;
    showLine: boolean = false;
    currentTool: string;
    resetAttributes: boolean = false;

    undo: { backgroundColor: string } = Globals.BACKGROUND_DARKGREY;
    redo: { backgroundColor: string } = Globals.BACKGROUND_DARKGREY;
    private toolParamMap: Map<string, ToolParam>;
    private functionMap: Map<string, () => void>;
    rectangleSelection: { backgroundColor: string } = Globals.BACKGROUND_WHITE;

    constructor(
        private toolController: ToolControllerService,
        private drawing: DrawingService,
        private router: Router,
        private colorService: ColorService,
        public exportService: ExportService,
        public carouselService: CarouselService,
        private undoRedoService: UndoRedoService,
        public remoteSaveService: RemoteSaveService,
        public gridService: GridService,
    ) {
        this.colorService.resetColorValues();
        this.toolController.resetWidth();
        this.toolParamMap = new Map();
        this.functionMap = new Map();
        this.initToolMap();
        this.initFunctionMap();
        this.currentTool = Globals.CRAYON_SHORTCUT;
        this.setTool(Globals.CRAYON_SHORTCUT);

        addEventListener('undoRedoState', (event: CustomEvent) => {
            this.undo = event.detail[0] ? Globals.BACKGROUND_WHITE : Globals.BACKGROUND_DARKGREY;
            this.redo = event.detail[1] ? Globals.BACKGROUND_WHITE : Globals.BACKGROUND_DARKGREY;
        });
    }
    // TODO REFACTOR ALL TOOLS
    goBack(): void {
        this.router.navigate(['..']);
        this.resetDrawingAttributes();
        this.gridService.resetGrid();
    }
    resetDrawingAttributes(): void {
        this.colorService.resetColorValues();
        this.toolController.resetWidth();
    }
    setTool(tool: string): void {
        this.toolController.setTool(tool);
    }

    selectCanvas(): void {
        this.toolController.selectionService.selectCanvas(this.drawing.canvas.width, this.drawing.canvas.height);
        this.currentTool = Globals.RECTANGLE_SELECTION_SHORTCUT;
        this.setTool(Globals.RECTANGLE_SELECTION_SHORTCUT);
    }
    openCarousel(): void {
        this.carouselService.initialiserCarousel();
    }
    openSave(): void {
        this.remoteSaveService.showModalSave = true;
    }

    showAerosolInterface(): void {
        this.showAerosol = this.currentTool === Globals.AEROSOL_SHORTCUT;
    }
    showLineOptions(): void {
        this.showLine = this.currentTool === Globals.LINE_SHORTCUT;
    }
    openExport(): void {
        this.exportService.showModalExport = true;
    }
    showShapeOptions(): void {
        this.shapeOptions = this.currentTool === Globals.RECTANGLE_SHORTCUT || this.currentTool === Globals.ELLIPSIS_SHORTCUT;
    }

    annulerSelection(): void {
        if (this.toolController.selectionService.inSelection) {
            this.toolController.selectionService.onEscape();
        }
    }
    openTool(showWidth: boolean, toolname: string): void {
        this.showWidth = showWidth;
        this.resetAttributes = !this.resetAttributes;
        this.currentTool = toolname;

        this.showLineOptions();
        this.showAerosolInterface();
        this.showShapeOptions();
        this.annulerSelection();
    }

    newCanvas(): void {
        this.colorService.resetColorValues();
        this.toolController.resetWidth();
        this.toolController.resetToolsMode();
        this.drawing.newCanvas();
        this.gridService.resetGrid();
        this.toolController.lineService.clearPath();
        this.currentTool = Globals.CRAYON_SHORTCUT;
        this.setTool(Globals.CRAYON_SHORTCUT);
        const eventContinue: CustomEvent = new CustomEvent('saveState');
        dispatchEvent(eventContinue);
    }
    showGrid(): void {
        this.gridService.toggleGrid();
    }

    @HostListener('window:keydown', ['$event'])
    onKeyPress($event: KeyboardEvent): void {
        if (!this.exportService.showModalExport && !this.carouselService.showCarousel && !this.remoteSaveService.showModalSave) {
            if (this.functionMap.has([$event.shiftKey, $event.ctrlKey, $event.key].join())) {
                this.functionMap.get([$event.shiftKey, $event.ctrlKey, $event.key].join())?.call(this);
                $event.preventDefault();
            }

            if (this.toolController.focused) {
                this.handleShortcuts($event);
            }
        }
    }

    initToolMap(): void {
        // the key is a joined string comprised of the event shiftkey,eventCtrlKey,and the shortcut
        this.toolParamMap
            .set([false, false, Globals.CRAYON_SHORTCUT].join(), { showWidth: true, toolName: Globals.CRAYON_SHORTCUT } as ToolParam)
            .set([false, false, Globals.LINE_SHORTCUT].join(), { showWidth: true, toolName: Globals.LINE_SHORTCUT } as ToolParam)
            .set([false, false, Globals.RECTANGLE_SHORTCUT].join(), { showWidth: true, toolName: Globals.RECTANGLE_SHORTCUT } as ToolParam)
            .set([false, false, Globals.ELLIPSIS_SHORTCUT].join(), { showWidth: true, toolName: Globals.ELLIPSIS_SHORTCUT } as ToolParam)
            .set([false, false, Globals.AEROSOL_SHORTCUT].join(), { showWidth: true, toolName: Globals.AEROSOL_SHORTCUT } as ToolParam)
            .set([false, false, Globals.STAMP_SHORTCUT].join(), { showWidth: true, toolName: Globals.STAMP_SHORTCUT } as ToolParam)
            .set([false, false, Globals.RECTANGLE_SELECTION_SHORTCUT].join(), {
                showWidth: false,
                toolName: Globals.RECTANGLE_SELECTION_SHORTCUT,
            } as ToolParam);
    }
    initFunctionMap(): void {
        // the key is a joined string comprised of the event shiftkey,eventCtrlKey,and the shortcut
        this.functionMap
            .set([false, true, Globals.NEW_DRAWING_EVENT].join(), this.newCanvas)
            .set([false, true, Globals.EXPORT_SHORTCUT].join(), this.openExport)
            .set([false, true, Globals.CAROUSEL_SHORTCUT].join(), this.openCarousel)
            .set([false, true, Globals.CANVAS_SELECTION_EVENT].join(), this.selectCanvas)
            .set([false, true, Globals.CANVAS_SAVE_SHORTCUT].join(), this.openSave)
            .set([true, true, Globals.REDO_SHORTCUT].join(), this.redoAction)
            .set([false, true, Globals.UNDO_SHORTCUT].join(), this.undoAction)
            .set([false, false, Globals.GRID_SHORTCUT].join(), this.showGrid);
    }

    handleShortcuts(event: KeyboardEvent): void {
        const key: string = [event.shiftKey, event.ctrlKey, event.key].join();
        const currentToolOptions = this.toolParamMap.get(key);
        if (currentToolOptions != undefined) {
            this.setTool(currentToolOptions.toolName);
            this.openTool(currentToolOptions.showWidth, currentToolOptions.toolName);
            event.preventDefault();
        }
    }

    undoAction(): void {
        if (!this.toolController.selectionService.inSelection) {
            this.undoRedoService.undo();
        }
    }

    redoAction(): void {
        if (!this.toolController.selectionService.inSelection) {
            this.undoRedoService.redo();
        }
    }
}
