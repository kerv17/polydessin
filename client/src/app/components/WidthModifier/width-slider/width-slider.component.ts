import { AfterViewInit, Component, Input } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-width-slider',
    templateUrl: './width-slider.component.html',
    styleUrls: ['./width-slider.component.scss'],
})
export class WidthSliderComponent implements AfterViewInit {
    @Input() width: number = 1;

    constructor(private drawingService: DrawingService) {}

    getSliderValue(evt: MatSliderChange): void {
        this.drawingService.width = evt.value || 1;
        this.width = this.drawingService.width;
        this.updateWidth();
    }

    ngAfterViewInit(): void {
        this.updateWidth();
    }

    updateWidth(): void {
        (document.getElementById('width') as HTMLInputElement).value = this.drawingService.width.toString();
        this.width = this.drawingService.width;
    }

    setWidth(): void {
        const placeholder: string = (document.getElementById('width') as HTMLInputElement).value;
        const verifier = parseInt(placeholder, 10);
        this.drawingService.width = verifier;
        this.width = this.drawingService.width;
    }
}
