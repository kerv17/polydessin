import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { ColorService } from '@app/services/color/color.service';

const rgbValueStart = 5;

@Component({
    selector: 'app-color-modal',
    templateUrl: './color-modal.component.html',
    styleUrls: ['./color-modal.component.scss'],
})
export class ColorModalComponent implements AfterViewInit {
    hue: string;
    color: string;
    rValue: string = '00';
    gValue: string = '00';
    bValue: string = '00';

    @Output()
    isVisible: EventEmitter<boolean> = new EventEmitter(true);

    @Output()
    colorModified: EventEmitter<string> = new EventEmitter(true);

    constructor(private colorService: ColorService) {}

    ngAfterViewInit(): void {
        if (this.colorService.currentColor === 'Primary') {
            this.color = this.colorService.primaryColor;
        } else if (this.colorService.currentColor === 'Secondary') {
            this.color = this.colorService.secondaryColor;
        }
        this.setColorInputValue();
    }

    confirmColor(): void {
        if (this.colorService.currentColor === 'Primary') {
            if (this.color !== this.colorService.primaryColor) {
                this.colorService.saveColor(this.colorService.primaryColor);
                this.colorService.primaryColor = this.color;
            }
        } else if (this.colorService.currentColor === 'Secondary') {
            if (this.color !== this.colorService.secondaryColor) {
                this.colorService.saveColor(this.colorService.secondaryColor);
                this.colorService.secondaryColor = this.color;
            }
        }
        this.colorModified.emit(this.color);
        this.isVisible.emit(false);
    }

    cancel(): void {
        this.isVisible.emit(false);
    }

    // affiche la valeur rgb de la couleur sélectionnée par la palette de couleur
    setColorInputValue(): void {
        if (this.color !== undefined) {
            const subColor: string = this.color.substring(rgbValueStart, this.color.length - 1);
            const splitColor: string[] = subColor.split(',');

            this.rValue = parseInt(splitColor[0], 10).toString(16);
            this.gValue = parseInt(splitColor[1], 10).toString(16);
            this.bValue = parseInt(splitColor[2], 10).toString(16);
        } else {
            this.rValue = '00';
            this.gValue = '00';
            this.bValue = '00';
        }
    }

    // met à jour la couleur lorsqu'on entre manuellement des valeurs rgb
    updateColorFromInput(): void {
        if (
            this.colorService.isHexadecimal(this.rValue) &&
            this.colorService.isHexadecimal(this.gValue) &&
            this.colorService.isHexadecimal(this.bValue)
        ) {
            this.color = 'rgba(' + parseInt(this.rValue, 16) + ',' + parseInt(this.gValue, 16) + ',' + parseInt(this.bValue, 16) + ',1)';
            this.hue = this.color;
        } else {
            this.setColorInputValue();
        }
    }
}
