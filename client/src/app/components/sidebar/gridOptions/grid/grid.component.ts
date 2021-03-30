import { Component, OnInit } from '@angular/core';
import { GridService } from '@app/services/grid/grid.service';
@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
    constructor(private gridService: GridService) {
        gridService.showGrid = true;
        this.gridService.drawGrid();
    }

    ngOnInit() {
        //this.gridService.currentlyNothing();
        this.gridService.drawGrid();
    }
}
