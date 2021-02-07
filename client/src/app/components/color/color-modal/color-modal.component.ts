import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { ColorService } from '@app/services/color/color.service';

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
    opacity: string = '100';

    @Output()
    isVisible: EventEmitter<boolean> = new EventEmitter(true);

    @Output()
    colorModified: EventEmitter<string> = new EventEmitter(true);

    constructor(private colorService: ColorService) {}

    ngAfterViewInit(): void {
        this.color = this.colorService.selectedColor();
        this.setColorInputValue();
        this.updateOpacity();
    }

    confirmColor(): void {
        this.colorService.confirmColorSelection(this.color);
        this.colorModified.emit(this.color);
        this.isVisible.emit(false);
    }

    cancel(): void {
        this.isVisible.emit(false);
    }

    // affiche la valeur rgb de la couleur sélectionnée par la palette de couleur
    setColorInputValue(): void {
        if (this.color !== undefined) {
            const splitColor: string[] = this.colorService.readRGBValues(this.color);
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

    // met à jour la couleur lorsque l'opacité est changée manuellement
    updateOpacity(): void {
        const opacity: string = this.colorService.verifyOpacityInput(this.opacity);
        if (opacity === '1') {
            this.opacity = '100';
        }
        const splitColor: string[] = this.colorService.readRGBValues(this.color);
        this.color = 'rgba(' + splitColor[0] + ',' + splitColor[1] + ',' + splitColor[2] + ',' + opacity + ')';
    }

    // Restreint les caractères pour l'opacité à (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
    omitUnwantedChars(event: KeyboardEvent): boolean {
        const key = event.key.charCodeAt(0);
        return key >= '0'.charCodeAt(0) && key <= '9'.charCodeAt(0);
    }

    // Restreint les caractères pour la couleur à (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, a, b, c, d, e, f)
    omitUnwantedColorValue(event: KeyboardEvent): boolean {
        const key = event.key.charCodeAt(0);
        return (key >= '0'.charCodeAt(0) && key <= '9'.charCodeAt(0)) || (key >= 'a'.charCodeAt(0) && key <= 'f'.charCodeAt(0));
    }
}
