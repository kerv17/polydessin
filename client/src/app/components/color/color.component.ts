import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ColorService } from '@app/services/color/color.service';

@Component({
    selector: 'app-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.scss'],
})
export class ColorComponent implements AfterViewInit, OnChanges {
    primaryColor: string;
    secondaryColor: string;
    visibility: boolean;
    recentColors: string[] = new Array();

    @Input()
    reset: boolean;

    constructor(private colorService: ColorService) {}

    ngAfterViewInit(): void {
        this.updateColor();
        this.visibility = this.colorService.modalVisibility;
        this.recentColors = this.colorService.recentColors;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.reset) {
            this.updateColor();
            this.visibility = this.colorService.modalVisibility;
            this.recentColors = this.colorService.recentColors;
        }
    }

    invert(): void {
        const tempColor: string = this.primaryColor;
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

    closeModal(): void {
        this.visibility = false;
        this.colorService.modalVisibility = false;
    }

    updateColor(): void {
        this.primaryColor = this.colorService.primaryColor;
        this.secondaryColor = this.colorService.secondaryColor;
    }

    selectPrimaryColor(color: string): void {
        if (!this.colorService.modalVisibility) {
            this.colorService.saveColor(this.primaryColor);
            this.primaryColor = color;
            this.colorService.primaryColor = this.primaryColor;
        }
    }

    selectSecondaryColor(color: string, event: MouseEvent): boolean {
        if (!this.colorService.modalVisibility) {
            this.colorService.saveColor(this.secondaryColor);
            this.secondaryColor = color;
            this.colorService.secondaryColor = this.secondaryColor;
        }
        // pour prévenir l'ouverture du menu contextuel lorsqu'on clique avec le bouton droit de la souris
        return false;
    }
}