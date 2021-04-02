import { Component, OnInit } from '@angular/core';
import { StampService } from '@app/services/tools/ToolServices/stamp.service';

@Component({
    selector: 'stamp-selector',
    templateUrl: './stamp.component.html',
    styleUrls: ['./stamp.component.scss'],
})
export class StampComponent implements OnInit {
    constructor(private stampService: StampService) {}

    currentStamp: string;
    ngOnInit(): void {
        this.currentStamp = this.stampService.toolMode;
    }

    setImage(name: string): void {
        this.stampService.toolMode = name;
        this.currentStamp = name;
    }
}
