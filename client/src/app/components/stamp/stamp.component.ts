import { Component, OnInit } from '@angular/core';
import { StampService } from '@app/services/tools/ToolServices/stamp.service';

@Component({
    selector: 'stamp-selector',
    templateUrl: './stamp.component.html',
    styleUrls: ['./stamp.component.scss'],
})
export class StampComponent implements OnInit {
    constructor(private stampService: StampService) {}
    path: string = '../../../assets/Stamp/';
    stamps: string[] = ['heart.png', 'star.png', 'bird.png', 'coin.png', 'earth.png', 'fire.png'];
    currentStamp: string = this.stamps[0];
    ngOnInit(): void {
        this.stampService.toolMode = this.currentStamp;
    }

    setImage(name: string): void {
        this.stampService.toolMode = name;
        this.currentStamp = name;
    }
}
