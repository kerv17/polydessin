import { Component, Input, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-width-slider',
    templateUrl: './width-slider.component.html',
    styleUrls: ['./width-slider.component.scss'],
})
export class WidthSliderComponent implements OnInit {
    @Input() width: number = 1;
    constructor(private drawingService: DrawingService) {}
    getSliderValue(evt: MatSliderChange) {
        this.drawingService.width = evt.value || 1;
        this.width = this.drawingService.width;
        this.updateWidth();
    }
    ngAfterViewInit(): void {
        this.updateWidth();
    }
    updateWidth() {
        (<HTMLInputElement>document.getElementById('width')).value = this.drawingService.width.toString();
        this.width = this.drawingService.width;
    }

    setWidth() {
        let placeholder: string = (<HTMLInputElement>document.getElementById('width')).value;
        let verifier = parseInt(placeholder);

        this.drawingService.width = verifier;
        this.width = this.drawingService.width;

        //window.alert(this.width);
    }
    ngOnInit(): void {}
}
