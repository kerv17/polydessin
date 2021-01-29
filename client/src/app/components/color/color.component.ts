import { AfterViewInit, Component } from '@angular/core';
import { ColorService } from '@app/services/color/color.service';

@Component({
    selector: 'app-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.scss'],
})
export class ColorComponent implements AfterViewInit {
    public primaryColor: string;
    public secondaryColor: string;
    public visibility: boolean;
    public recentColors: string[];

    constructor(private colorService: ColorService) {}

    ngAfterViewInit(): void {
        this.updateColor();
        this.visibility = this.colorService.modalVisibility;
        this.recentColors = this.colorService.recentColors;
    }

    invert() {
        let tempColor: string = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = tempColor;

        this.colorService.primaryColor = this.primaryColor;
        this.colorService.secondaryColor = this.secondaryColor;
    }

    openModal(color: string): void {
        this.colorService.modalVisibility = true;
        this.colorService.currentColor = color;
        this.visibility = this.colorService.modalVisibility;
    }

    closeModal() {
        this.visibility = false;
    }

    updateColor() {
        this.primaryColor = this.colorService.primaryColor;
        this.secondaryColor = this.colorService.secondaryColor;
    }

    ngOnInit(): void {}
}
